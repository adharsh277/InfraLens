"""Infrastructure parsing service for extracting resources from IaC files."""

import hcl2
import yaml
import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class InfrastructureParser:
    """Parse infrastructure as code files (Terraform, Kubernetes, etc.)."""
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.terraform_resources = []
        self.kubernetes_resources = []
        self.docker_resources = []
    
    def parse_all(self) -> Dict[str, List[Dict[str, Any]]]:
        """Parse all infrastructure files in repository.
        
        Returns:
            dict containing parsed resources grouped by type
        """
        if not self.repo_path.exists():
            logger.warning(f"Repository path does not exist: {self.repo_path}")
            return {
                "terraform": [],
                "kubernetes": [],
                "docker": [],
                "total": 0
            }
        
        try:
            self._parse_terraform()
            self._parse_kubernetes()
            self._parse_docker()
            
            total = len(self.terraform_resources) + len(self.kubernetes_resources) + len(self.docker_resources)
            
            return {
                "terraform": self.terraform_resources,
                "kubernetes": self.kubernetes_resources,
                "docker": self.docker_resources,
                "total": total
            }
        except Exception as e:
            logger.error(f"Error parsing infrastructure files: {e}")
            return {
                "terraform": [],
                "kubernetes": [],
                "docker": [],
                "total": 0,
                "error": str(e)
            }
    
    def _parse_terraform(self) -> None:
        """Parse Terraform (.tf) files."""
        tf_files = list(self.repo_path.rglob("*.tf"))
        
        if not tf_files:
            logger.debug("No Terraform files found")
            return
        
        logger.info(f"Found {len(tf_files)} Terraform files")
        
        for tf_file in tf_files:
            try:
                with open(tf_file, "r") as f:
                    content = f.read()
                    
                    # Try to parse HCL2
                    try:
                        data = hcl2.loads(content)
                    except Exception as e:
                        logger.warning(f"Failed to parse {tf_file}: {e}")
                        # Try simple regex-based parsing as fallback
                        self._parse_terraform_simple(content, str(tf_file))
                        continue
                    
                    # Extract resources
                    if "resource" in data:
                        for resource_block in data["resource"]:
                            for resource_type, resources in resource_block.items():
                                for resource_name, resource_config in resources.items():
                                    self.terraform_resources.append({
                                        "type": resource_type,
                                        "name": resource_name,
                                        "file": str(tf_file.relative_to(self.repo_path)),
                                        "config": resource_config if isinstance(resource_config, dict) else {}
                                    })
                    
                    logger.debug(f"Parsed {tf_file}: found {len(self.terraform_resources)} resources")
                    
            except Exception as e:
                logger.error(f"Error parsing Terraform file {tf_file}: {e}")
    
    def _parse_terraform_simple(self, content: str, filepath: str) -> None:
        """Fallback simple parsing for Terraform files."""
        import re
        
        # Match resource "type" "name" { ... }
        pattern = r'resource\s+"([^"]+)"\s+"([^"]+)"\s*\{'
        matches = re.finditer(pattern, content)
        
        for match in matches:
            resource_type = match.group(1)
            resource_name = match.group(2)
            
            # Only capture common AWS resources
            if resource_type.startswith("aws_"):
                self.terraform_resources.append({
                    "type": resource_type,
                    "name": resource_name,
                    "file": filepath,
                    "config": {}
                })
    
    def _parse_kubernetes(self) -> None:
        """Parse Kubernetes YAML files."""
        yaml_files = []
        
        # Look for .yaml and .yml files
        yaml_files.extend(self.repo_path.rglob("*.yaml"))
        yaml_files.extend(self.repo_path.rglob("*.yml"))
        
        if not yaml_files:
            logger.debug("No Kubernetes/YAML files found")
            return
        
        logger.info(f"Found {len(yaml_files)} YAML files")
        
        for yaml_file in yaml_files:
            try:
                with open(yaml_file, "r") as f:
                    try:
                        # Parse YAML (can contain multiple documents)
                        documents = yaml.safe_load_all(f.read())
                        
                        for doc in documents:
                            if doc is None:
                                continue
                            
                            if not isinstance(doc, dict):
                                continue
                            
                            kind = doc.get("kind")
                            metadata = doc.get("metadata", {})
                            name = metadata.get("name", "unknown")
                            
                            if kind:
                                self.kubernetes_resources.append({
                                    "type": kind,
                                    "name": name,
                                    "file": str(yaml_file.relative_to(self.repo_path)),
                                    "namespace": metadata.get("namespace", "default"),
                                    "labels": metadata.get("labels", {})
                                })
                        
                        logger.debug(f"Parsed {yaml_file}: found {len(self.kubernetes_resources)} K8s resources")
                        
                    except yaml.YAMLError as e:
                        logger.warning(f"Invalid YAML in {yaml_file}: {e}")
                        
            except Exception as e:
                logger.error(f"Error parsing YAML file {yaml_file}: {e}")
    
    def _parse_docker(self) -> None:
        """Parse Docker-related files."""
        # Look for Dockerfile and docker-compose files
        docker_files = []
        
        for root, dirs, files in os.walk(self.repo_path):
            for file in files:
                if file == "Dockerfile" or file.startswith("Dockerfile."):
                    docker_files.append(os.path.join(root, file))
                elif file == "docker-compose.yml" or file == "docker-compose.yaml":
                    docker_files.append(os.path.join(root, file))
        
        if not docker_files:
            logger.debug("No Docker files found")
            return
        
        logger.info(f"Found {len(docker_files)} Docker files")
        
        for docker_file in docker_files:
            try:
                if docker_file.endswith(("docker-compose.yml", "docker-compose.yaml")):
                    self._parse_docker_compose(docker_file)
                else:
                    self._parse_dockerfile(docker_file)
                    
            except Exception as e:
                logger.error(f"Error parsing Docker file {docker_file}: {e}")
    
    def _parse_dockerfile(self, filepath: str) -> None:
        """Parse Dockerfile."""
        import re
        
        try:
            with open(filepath, "r") as f:
                content = f.read()
            
            # Look for FROM instruction to detect base image
            from_match = re.search(r'^FROM\s+(\S+)', content, re.MULTILINE)
            base_image = from_match.group(1) if from_match else "unknown"
            
            # Count stages (multi-stage build)
            stages = len(re.findall(r'^FROM\s+', content, re.MULTILINE))
            
            self.docker_resources.append({
                "type": "Dockerfile",
                "name": Path(filepath).name,
                "file": str(Path(filepath).relative_to(self.repo_path)),
                "base_image": base_image,
                "stages": stages
            })
            
        except Exception as e:
            logger.error(f"Error parsing Dockerfile {filepath}: {e}")
    
    def _parse_docker_compose(self, filepath: str) -> None:
        """Parse docker-compose file."""
        try:
            with open(filepath, "r") as f:
                content = yaml.safe_load(f)
            
            if not content:
                return
            
            services = content.get("services", {})
            
            for service_name, service_config in services.items():
                self.docker_resources.append({
                    "type": "docker-compose-service",
                    "name": service_name,
                    "file": str(Path(filepath).relative_to(self.repo_path)),
                    "image": service_config.get("image", "unknown"),
                    "ports": service_config.get("ports", [])
                })
            
        except Exception as e:
            logger.error(f"Error parsing docker-compose {filepath}: {e}")


def parse_infrastructure(repo_path: str) -> Dict[str, Any]:
    """Parse all infrastructure files in a repository.
    
    Args:
        repo_path: Path to repository
        
    Returns:
        dict containing parsed infrastructure resources
    """
    parser = InfrastructureParser(repo_path)
    return parser.parse_all()
