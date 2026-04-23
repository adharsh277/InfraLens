"""Repository cloning and management service."""

import os
import subprocess
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

BASE_TEMP_DIR = "temp_repos"


def ensure_temp_dir() -> None:
    """Ensure temp_repos directory exists."""
    os.makedirs(BASE_TEMP_DIR, exist_ok=True)


def clone_repo(repo_url: str, job_id: str) -> str:
    """Clone repository into temp_repos/{job_id} with shallow clone.
    
    Args:
        repo_url: GitHub repository URL
        job_id: Unique job identifier
        
    Returns:
        Path to cloned repository
        
    Raises:
        RuntimeError: If git clone fails
    """
    ensure_temp_dir()
    
    repo_path = os.path.join(BASE_TEMP_DIR, job_id)
    
    # Use shallow clone to reduce size
    cmd = ["git", "clone", "--depth", "1", repo_url, repo_path]
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60,  # 60 second timeout
        )
        
        if result.returncode != 0:
            error_msg = result.stderr.strip() or "Unknown git error"
            logger.error(f"Git clone failed for {repo_url}: {error_msg}")
            raise RuntimeError(f"Failed to clone repository: {error_msg}")
        
        logger.info(f"Successfully cloned {repo_url} to {repo_path}")
        return repo_path
        
    except subprocess.TimeoutExpired:
        raise RuntimeError("Repository clone timed out (>60s)")
    except Exception as e:
        logger.error(f"Unexpected error during clone: {e}")
        raise RuntimeError(f"Unexpected error during clone: {str(e)}")


def cleanup_repo(job_id: str) -> None:
    """Delete cloned repository directory.
    
    Args:
        job_id: Unique job identifier
    """
    repo_path = os.path.join(BASE_TEMP_DIR, job_id)
    
    if os.path.exists(repo_path):
        import shutil
        try:
            shutil.rmtree(repo_path)
            logger.info(f"Cleaned up repository: {repo_path}")
        except Exception as e:
            logger.error(f"Failed to cleanup {repo_path}: {e}")


def validate_github_url(repo_url: str) -> bool:
    """Validate GitHub repository URL format.
    
    Args:
        repo_url: Repository URL to validate
        
    Returns:
        True if URL is valid GitHub URL
    """
    # Basic GitHub URL validation
    if not isinstance(repo_url, str):
        return False
    
    url = repo_url.strip()
    
    # Must start with https://github.com/
    if not url.startswith("https://github.com/"):
        return False
    
    # Must have at least owner/repo (4 path segments)
    parts = url.split("/")
    if len(parts) < 5:  # https:, , github.com, owner, repo
        return False
    
    return True
