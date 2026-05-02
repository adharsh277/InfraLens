"""API request and response schemas."""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any, List


class AnalyzeRequest(BaseModel):
    """POST /analyze request body."""

    repo_url: HttpUrl = Field(
        ..., description="GitHub repository URL (must be public)"
    )

    class Config:
        json_schema_extra = {
            "example": {"repo_url": "https://github.com/user/repo"}
        }


class JobResponse(BaseModel):
    """Response containing job_id and status."""

    job_id: str = Field(..., description="Unique job identifier")
    status: str = Field(
        ..., description="Job status: processing, completed, or failed"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "job_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "processing",
            }
        }


class JobStatusResponse(BaseModel):
    """Response for GET /status/{job_id}."""

    job_id: str
    status: str
    repo_url: str
    path: Optional[str] = None
    error: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "job_id": "550e8400-e29b-41d4-a716-446655440000",
                "status": "completed",
                "repo_url": "https://github.com/user/repo",
                "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
                "error": None,
                "created_at": "2026-04-23T12:00:00",
                "completed_at": "2026-04-23T12:05:00",
                "analysis": {
                    "success": True,
                    "main_language": "Python",
                    "languages": {"python": 150, "javascript": 45},
                    "file_count": 195,
                    "important_files": [],
                    "architecture_insights": [],
                    "infrastructure": {
                        "terraform": [
                            {"type": "aws_instance", "name": "web", "file": "main.tf"},
                            {"type": "aws_db_instance", "name": "db", "file": "main.tf"}
                        ],
                        "kubernetes": [
                            {"type": "Deployment", "name": "api", "file": "deploy.yaml", "namespace": "default"},
                            {"type": "Service", "name": "api-svc", "file": "deploy.yaml", "namespace": "default"}
                        ],
                        "docker": [
                            {"type": "Dockerfile", "name": "Dockerfile", "file": "Dockerfile", "base_image": "python:3.11"}
                        ],
                        "total": 5
                    }
                }
            }
        }


class NodeMetadata(BaseModel):
    """Metadata for a graph node."""

    full_type: Optional[str] = None
    resource_name: Optional[str] = None
    kind: Optional[str] = None
    namespace: Optional[str] = None
    labels: Optional[Dict[str, Any]] = None
    base_image: Optional[str] = None
    services: Optional[List[str]] = None


class Node(BaseModel):
    """Infrastructure graph node."""

    id: str = Field(..., description="Unique node identifier")
    label: str = Field(..., description="Display label")
    type: str = Field(..., description="Resource type (e.g., aws_instance, Deployment)")
    category: str = Field(..., description="Resource category: terraform, kubernetes, or docker")
    icon: str = Field(..., description="Emoji icon for display")
    file: str = Field(..., description="Source file path")
    metadata: Dict[str, Any] = Field(..., description="Additional resource metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "tf-aws_instance-web",
                "label": "web",
                "type": "aws_instance",
                "category": "terraform",
                "icon": "📦",
                "file": "main.tf",
                "metadata": {
                    "full_type": "aws_instance",
                    "resource_name": "web"
                }
            }
        }


class Edge(BaseModel):
    """Infrastructure graph edge (relationship)."""

    source: str = Field(..., description="Source node ID")
    target: str = Field(..., description="Target node ID")
    type: str = Field(..., description="Relationship type (e.g., connects_to, exposes)")
    label: str = Field(..., description="Display label for relationship")

    class Config:
        json_schema_extra = {
            "example": {
                "source": "tf-aws_instance-web",
                "target": "tf-aws_db_instance-db",
                "type": "connects_to",
                "label": "Connects To"
            }
        }


class GraphResponse(BaseModel):
    """Infrastructure relationship graph."""

    nodes: List[Node] = Field(..., description="List of infrastructure nodes")
    edges: List[Edge] = Field(..., description="List of relationships between nodes")
    total_nodes: int = Field(..., description="Total number of nodes")
    total_edges: int = Field(..., description="Total number of edges")
    error: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "nodes": [
                    {
                        "id": "tf-aws_instance-web",
                        "label": "web",
                        "type": "aws_instance",
                        "category": "terraform",
                        "icon": "📦",
                        "file": "main.tf",
                        "metadata": {}
                    }
                ],
                "edges": [
                    {
                        "source": "tf-aws_instance-web",
                        "target": "tf-aws_db_instance-db",
                        "type": "connects_to",
                        "label": "Connects To"
                    }
                ],
                "total_nodes": 1,
                "total_edges": 1
            }
        }


class ErrorResponse(BaseModel):
    """Generic error response."""

    detail: str = Field(..., description="Error message")

    class Config:
        json_schema_extra = {
            "example": {"detail": "Invalid GitHub URL format"}
        }
