from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path


def clone_repository(repo_url: str, destination_root: str) -> Path:
    """Clone the target repository into a temporary location for processing."""
    repo_name = repo_url.rstrip("/").split("/")[-1]
    target_dir = Path(destination_root) / repo_name

    if target_dir.exists():
        shutil.rmtree(target_dir)

    command = ["git", "clone", "--depth", "1", repo_url, str(target_dir)]
    completed = subprocess.run(command, capture_output=True, text=True)

    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "Unable to clone repository")

    return target_dir


def analyze_repository(repo_url: str) -> None:
    """Temporary analysis pipeline that clones and cleans up a repository."""
    with tempfile.TemporaryDirectory(prefix="infralens-") as temp_dir:
        clone_repository(repo_url, temp_dir)
