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


class ErrorResponse(BaseModel):
    """Generic error response."""

    detail: str = Field(..., description="Error message")

    class Config:
        json_schema_extra = {
            "example": {"detail": "Invalid GitHub URL format"}
        }
