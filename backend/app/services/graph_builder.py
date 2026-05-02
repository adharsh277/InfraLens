"""Graph builder service for creating infrastructure relationship graphs."""

import logging
from typing import Dict, List, Any, Set, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)


class GraphBuilder:
    """Build infrastructure relationship graphs from parsed resources."""
    
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.node_map = {}  # Map of (type, name) -> node_id for quick lookup
    
    def build_graph(self, infrastructure: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """Build complete graph from infrastructure resources.
        
        Args:
            infrastructure: Dict containing terraform, kubernetes, docker resource lists
            
        Returns:
            dict with 'nodes' and 'edges' arrays
        """
        self.nodes = []
        self.edges = []
        self.node_map = {}
        
        try:
            # Create nodes from all resources
            self._create_terraform_nodes(infrastructure.get("terraform", []))
            self._create_kubernetes_nodes(infrastructure.get("kubernetes", []))
            self._create_docker_nodes(infrastructure.get("docker", []))
            
            # Detect relationships between nodes
            self._detect_relationships(infrastructure)
            
            return {
                "nodes": self.nodes,
                "edges": self.edges,
                "total_nodes": len(self.nodes),
                "total_edges": len(self.edges)
            }
        except Exception as e:
            logger.error(f"Error building graph: {e}")
            return {
                "nodes": [],
                "edges": [],
                "total_nodes": 0,
                "total_edges": 0,
                "error": str(e)
            }
    
    def _create_terraform_nodes(self, terraform_resources: List[Dict[str, Any]]) -> None:
        """Create nodes from Terraform resources."""
        for resource in terraform_resources:
            node_id = f"tf-{resource['type']}-{resource['name']}"
            
            node = {
                "id": node_id,
                "label": resource["name"],
                "type": resource["type"],
                "category": "terraform",
                "icon": "📦",
                "file": resource.get("file", ""),
                "metadata": {
                    "full_type": resource["type"],
                    "resource_name": resource["name"]
                }
            }
            
            self.nodes.append(node)
            self.node_map[(resource["type"], resource["name"])] = node_id
            
        logger.info(f"Created {len(terraform_resources)} Terraform nodes")
    
    def _create_kubernetes_nodes(self, kubernetes_resources: List[Dict[str, Any]]) -> None:
        """Create nodes from Kubernetes resources."""
        for resource in kubernetes_resources:
            node_id = f"k8s-{resource['type']}-{resource['name']}"
            
            node = {
                "id": node_id,
                "label": resource["name"],
                "type": resource["type"],
                "category": "kubernetes",
                "icon": "☸️",
                "file": resource.get("file", ""),
                "metadata": {
                    "kind": resource["type"],
                    "namespace": resource.get("namespace", "default"),
                    "labels": resource.get("labels", {})
                }
            }
            
            self.nodes.append(node)
            self.node_map[(resource["type"], resource["name"])] = node_id
            
        logger.info(f"Created {len(kubernetes_resources)} Kubernetes nodes")
    
    def _create_docker_nodes(self, docker_resources: List[Dict[str, Any]]) -> None:
        """Create nodes from Docker resources."""
        for resource in docker_resources:
            node_id = f"docker-{resource['name']}"
            
            node = {
                "id": node_id,
                "label": resource["name"],
                "type": resource["type"],
                "category": "docker",
                "icon": "🐳",
                "file": resource.get("file", ""),
                "metadata": {
                    "base_image": resource.get("base_image", ""),
                    "services": resource.get("services", [])
                }
            }
            
            self.nodes.append(node)
            self.node_map[(resource["type"], resource["name"])] = node_id
            
        logger.info(f"Created {len(docker_resources)} Docker nodes")
    
    def _detect_relationships(self, infrastructure: Dict[str, List[Dict[str, Any]]]) -> None:
        """Detect relationships between resources."""
        terraform_resources = infrastructure.get("terraform", [])
        kubernetes_resources = infrastructure.get("kubernetes", [])
        docker_resources = infrastructure.get("docker", [])
        
        # Terraform relationships
        self._detect_terraform_relationships(terraform_resources)
        
        # Kubernetes relationships
        self._detect_kubernetes_relationships(kubernetes_resources)
        
        # Cross-layer relationships (Docker -> Kubernetes, K8s -> Terraform, etc.)
        self._detect_cross_layer_relationships(
            terraform_resources, kubernetes_resources, docker_resources
        )
        
        logger.info(f"Detected {len(self.edges)} relationships")
    
    def _detect_terraform_relationships(self, resources: List[Dict[str, Any]]) -> None:
        """Detect relationships within Terraform resources.
        
        Examples:
        - aws_instance connects to aws_security_group (via vpc_security_group_ids)
        - aws_instance connects to aws_db_instance (via dependency on same VPC)
        - aws_db_instance connects to aws_db_subnet_group (via subnet group)
        """
        for i, resource in enumerate(resources):
            config = resource.get("config", {})
            
            # Security group relationships
            if resource["type"] == "aws_security_group_rule":
                # Connect to the security group it modifies
                sg_id = config.get("security_group_id")
                if sg_id:
                    self._add_edge(
                        f"tf-{resource['type']}-{resource['name']}",
                        f"tf-aws_security_group-{sg_id}",
                        "modifies"
                    )
            
            # RDS relationships
            elif resource["type"] == "aws_db_instance":
                # Connect to DB subnet group
                subnet_group = config.get("db_subnet_group_name")
                if subnet_group:
                    self._add_edge(
                        f"tf-{resource['type']}-{resource['name']}",
                        f"tf-aws_db_subnet_group-{subnet_group}",
                        "uses"
                    )
            
            # EC2 and compute relationships
            elif resource["type"] == "aws_instance":
                # Connect to VPC if specified
                subnet_id = config.get("subnet_id")
                if subnet_id:
                    self._add_edge(
                        f"tf-{resource['type']}-{resource['name']}",
                        f"tf-aws_subnet-{subnet_id}",
                        "launches_in"
                    )
            
            # ALB/Load balancer relationships
            elif resource["type"] in ["aws_lb", "aws_elb"]:
                # Connect to target groups
                target_groups = config.get("target_group_arn", [])
                if target_groups:
                    for tg in (target_groups if isinstance(target_groups, list) else [target_groups]):
                        self._add_edge(
                            f"tf-{resource['type']}-{resource['name']}",
                            f"tf-aws_lb_target_group-{tg}",
                            "routes_to"
                        )
            
            # Network ACL relationships
            elif resource["type"] == "aws_network_acl":
                vpc_id = config.get("vpc_id")
                if vpc_id:
                    self._add_edge(
                        f"tf-{resource['type']}-{resource['name']}",
                        f"tf-aws_vpc-{vpc_id}",
                        "protects"
                    )
    
    def _detect_kubernetes_relationships(self, resources: List[Dict[str, Any]]) -> None:
        """Detect relationships within Kubernetes resources.
        
        Examples:
        - Deployment exposes Service (via selector matching)
        - Pod runs in Namespace
        - Service targets Deployment (via selector)
        - ConfigMap mounted by Pod/Deployment
        """
        resource_dict = {}
        
        # Index resources by type and name for quick lookup
        for resource in resources:
            key = (resource["type"], resource["name"])
            resource_dict[key] = resource
        
        for resource in resources:
            config = resource.get("config", {}) if isinstance(resource.get("config", {}), dict) else {}
            
            # Deployment exposes Service
            if resource["type"] == "Deployment":
                selectors = config.get("spec", {}).get("selector", {}).get("matchLabels", {})
                namespace = resource.get("namespace", "default")
                
                # Find matching services
                for other in resources:
                    if other["type"] == "Service" and other.get("namespace") == namespace:
                        service_config = other.get("config", {})
                        service_selector = service_config.get("spec", {}).get("selector", {})
                        
                        # If service selector matches deployment labels, they're connected
                        if self._selectors_match(selectors, service_selector):
                            self._add_edge(
                                f"k8s-Deployment-{resource['name']}",
                                f"k8s-Service-{other['name']}",
                                "exposes"
                            )
            
            # Pod/Deployment mounts ConfigMap or Secret
            elif resource["type"] in ["Pod", "Deployment", "StatefulSet"]:
                volumes = config.get("spec", {}).get("volumes", [])
                
                for volume in volumes if volumes else []:
                    config_map = volume.get("configMap", {})
                    if config_map and config_map.get("name"):
                        self._add_edge(
                            f"k8s-{resource['type']}-{resource['name']}",
                            f"k8s-ConfigMap-{config_map.get('name')}",
                            "mounts"
                        )
                    
                    secret = volume.get("secret", {})
                    if secret and secret.get("secretName"):
                        self._add_edge(
                            f"k8s-{resource['type']}-{resource['name']}",
                            f"k8s-Secret-{secret.get('secretName')}",
                            "mounts"
                        )
            
            # Ingress routes to Service
            elif resource["type"] == "Ingress":
                rules = config.get("spec", {}).get("rules", [])
                for rule in rules if rules else []:
                    http = rule.get("http", {})
                    for path in http.get("paths", []) if http else []:
                        backend = path.get("backend", {})
                        service_name = backend.get("serviceName")
                        if service_name:
                            self._add_edge(
                                f"k8s-Ingress-{resource['name']}",
                                f"k8s-Service-{service_name}",
                                "routes_to"
                            )
    
    def _detect_cross_layer_relationships(
        self,
        terraform_resources: List[Dict[str, Any]],
        kubernetes_resources: List[Dict[str, Any]],
        docker_resources: List[Dict[str, Any]]
    ) -> None:
        """Detect relationships across infrastructure layers."""
        
        # Docker -> Kubernetes: If docker-compose services match K8s Deployments
        for docker in docker_resources:
            services = docker.get("metadata", {}).get("services", [])
            for service in services:
                # Try to find matching Kubernetes Deployment by name similarity
                for k8s in kubernetes_resources:
                    if k8s["type"] == "Deployment":
                        # Simple name matching (can be improved with better heuristics)
                        if service.lower() in k8s["name"].lower() or k8s["name"].lower() in service.lower():
                            self._add_edge(
                                f"docker-{docker['name']}",
                                f"k8s-Deployment-{k8s['name']}",
                                "defines"
                            )
        
        # Kubernetes -> Terraform: If K8s infrastructure is deployed on AWS
        # This is more heuristic-based since K8s doesn't explicitly reference Terraform
        for k8s in kubernetes_resources:
            # Services often expose compute resources defined in Terraform
            if k8s["type"] == "Service":
                # Check if there are any compute resources in Terraform
                for tf in terraform_resources:
                    if tf["type"] in ["aws_instance", "aws_eks_cluster", "aws_ecs_service"]:
                        # Weak connection: assume they're related if infrastructure exists
                        # This could be strengthened with more metadata
                        pass  # Only create strong connections when we have clear evidence
    
    def _selectors_match(self, selector1: Dict[str, str], selector2: Dict[str, str]) -> bool:
        """Check if two Kubernetes selectors match."""
        if not selector1 or not selector2:
            return False
        
        # All selector2 labels must be in selector1
        for key, value in selector2.items():
            if selector1.get(key) != value:
                return False
        
        return True
    
    def _add_edge(self, source_id: str, target_id: str, relation_type: str) -> None:
        """Add an edge between two nodes, avoiding duplicates."""
        # Check if nodes exist
        source_exists = any(n["id"] == source_id for n in self.nodes)
        target_exists = any(n["id"] == target_id for n in self.nodes)
        
        if not (source_exists and target_exists):
            logger.debug(f"Skipping edge {source_id} -> {target_id} (nodes not found)")
            return
        
        # Check for duplicate edges
        edge_hash = (source_id, target_id, relation_type)
        if any(
            (e["source"], e["target"], e["type"]) == edge_hash
            for e in self.edges
        ):
            return
        
        edge = {
            "source": source_id,
            "target": target_id,
            "type": relation_type,
            "label": relation_type.replace("_", " ").title()
        }
        
        self.edges.append(edge)
        logger.debug(f"Added edge: {source_id} -> {target_id} ({relation_type})")


def build_infrastructure_graph(infrastructure: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """Convenience function to build a graph from infrastructure data."""
    builder = GraphBuilder()
    return builder.build_graph(infrastructure)
