"""Analyze endpoint for repository processing."""

from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.core.job_manager import job_manager
from app.services.repo_service import clone_repo, validate_github_url
from app.models.schemas import AnalyzeRequest, JobResponse, JobStatusResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["analyze"])


def process_repo_background(job_id: str, repo_url: str) -> None:
    """Background task to clone and process repository.
    
    Args:
        job_id: Unique job identifier
        repo_url: Repository URL to clone
    """
    try:
        path = clone_repo(repo_url, job_id)
        job_manager.update_job(job_id, "completed", path=path)
        logger.info(f"Job {job_id} completed successfully")
    except Exception as e:
        error_msg = str(e)
        job_manager.update_job(job_id, "failed", error=error_msg)
        logger.error(f"Job {job_id} failed: {error_msg}")


@router.post("/analyze", response_model=JobResponse, status_code=202)
def analyze(
    payload: AnalyzeRequest, background_tasks: BackgroundTasks
) -> JobResponse:
    """Create analysis job for GitHub repository.
    
    Validates the URL, creates a job, and starts background processing.
    Returns immediately with job_id and processing status.
    
    Args:
        payload: Request containing repo_url
        background_tasks: FastAPI background task manager
        
    Returns:
        JobResponse with job_id and status="processing"
        
    Raises:
        HTTPException: If URL validation fails
    """
    repo_url = str(payload.repo_url)
    
    # Validate GitHub URL format
    if not validate_github_url(repo_url):
        logger.warning(f"Invalid GitHub URL: {repo_url}")
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub URL. Must be a public repository URL starting with https://github.com/",
        )
    
    # Create job
    job_id = job_manager.create_job(repo_url)
    logger.info(f"Created job {job_id} for {repo_url}")
    
    # Queue background task (non-blocking)
    background_tasks.add_task(process_repo_background, job_id, repo_url)
    
    return JobResponse(job_id=job_id, status="processing")


@router.get("/status/{job_id}", response_model=JobStatusResponse)
def get_status(job_id: str) -> JobStatusResponse:
    """Get status of analysis job.
    
    Args:
        job_id: Unique job identifier
        
    Returns:
        JobStatusResponse with current job status and metadata
        
    Raises:
        HTTPException: If job not found
    """
    job = job_manager.get_job(job_id)
    
    if not job:
        logger.warning(f"Job not found: {job_id}")
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    
    return JobStatusResponse(
        job_id=job.job_id,
        status=job.status,
        repo_url=job.repo_url,
        path=job.path,
        error=job.error,
        created_at=job.created_at,
        completed_at=job.completed_at,
    )
