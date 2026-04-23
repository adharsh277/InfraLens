"""Admin API endpoints for job inspection and debugging."""

from fastapi import APIRouter, HTTPException
from app.core.job_manager import job_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/jobs")
def list_all_jobs() -> dict:
    """List all jobs with their current status and metadata.
    
    Returns:
        Dictionary with all jobs indexed by job_id
        
    Note:
        Admin endpoint - no authentication required (Phase 2)
    """
    jobs = job_manager.get_all_jobs()
    logger.info(f"Admin: Retrieved {len(jobs)} jobs")
    return {"total": len(jobs), "jobs": jobs}


@router.get("/job/{job_id}")
def get_job_details(job_id: str) -> dict:
    """Get detailed information about a specific job.
    
    Args:
        job_id: Unique job identifier
        
    Returns:
        Detailed job information including timestamps and error details
        
    Raises:
        HTTPException: If job not found
        
    Note:
        Admin endpoint - useful for debugging failed jobs
    """
    job = job_manager.get_job(job_id)
    
    if not job:
        logger.warning(f"Admin: Job not found: {job_id}")
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    logger.info(f"Admin: Retrieved job details for {job_id}")
    return {"job": job.to_dict()}
