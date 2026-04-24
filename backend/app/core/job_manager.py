"""In-memory job manager for tracking analysis tasks."""

import uuid
from typing import Any, Optional, Dict
from dataclasses import dataclass, asdict, field
from datetime import datetime


@dataclass
class Job:
    """Represents a single analysis job."""

    job_id: str
    repo_url: str
    status: str  # "processing", "completed", "failed"
    path: Optional[str] = None
    error: Optional[str] = None
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    completed_at: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class JobManager:
    """Manages in-memory job storage and state."""

    def __init__(self) -> None:
        self._jobs: dict[str, Job] = {}

    def create_job(self, repo_url: str) -> str:
        """Create a new job and return job_id."""
        job_id = str(uuid.uuid4())
        self._jobs[job_id] = Job(
            job_id=job_id,
            repo_url=repo_url,
            status="processing",
        )
        return job_id

    def get_job(self, job_id: str) -> Optional[Job]:
        """Retrieve a job by ID."""
        return self._jobs.get(job_id)

    def update_job(
        self,
        job_id: str,
        status: str,
        path: Optional[str] = None,
        error: Optional[str] = None,
        analysis: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Update job status and metadata."""
        if job := self._jobs.get(job_id):
            job.status = status
            if path:
                job.path = path
            if error:
                job.error = error
            if analysis:
                job.analysis = analysis
            if status in ("completed", "failed"):
                job.completed_at = datetime.utcnow().isoformat()

    def get_all_jobs(self) -> dict[str, dict[str, Any]]:
        """Return all jobs as dictionaries."""
        return {job_id: job.to_dict() for job_id, job in self._jobs.items()}


# Global instance
job_manager = JobManager()
