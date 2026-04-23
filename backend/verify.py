#!/usr/bin/env python3
"""
InfraLens Backend Verification Script

Run this to verify the complete backend setup is working correctly.
"""

import sys
import subprocess
import json
from pathlib import Path

def print_header(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_info(text):
    print(f"ℹ️  {text}")

def check_files_exist():
    """Verify all required files are created."""
    print_header("FILE STRUCTURE CHECK")
    
    required_files = [
        "app/main.py",
        "app/core/job_manager.py",
        "app/services/repo_service.py",
        "app/api/analyze.py",
        "app/api/admin.py",
        "app/models/schemas.py",
        "requirements.txt",
        "BACKEND.md",
        "QUICKSTART.md",
        "IMPLEMENTATION.md",
    ]
    
    backend_dir = Path(__file__).parent
    
    for file_path in required_files:
        full_path = backend_dir / file_path
        if full_path.exists():
            print_success(f"{file_path}")
        else:
            print_error(f"{file_path} - NOT FOUND")
            return False
    
    # Check directories
    temp_repos = backend_dir / "temp_repos"
    if temp_repos.exists() and temp_repos.is_dir():
        print_success("temp_repos/ directory")
    else:
        print_error("temp_repos/ directory - NOT FOUND")
        return False
    
    return True

def check_imports():
    """Verify all imports work correctly."""
    print_header("IMPORT CHECK")
    
    imports = [
        "from app.core.job_manager import job_manager, Job",
        "from app.services.repo_service import clone_repo, validate_github_url",
        "from app.api import analyze, admin",
        "from app.models.schemas import AnalyzeRequest, JobResponse",
        "from app.main import app",
    ]
    
    for import_stmt in imports:
        try:
            exec(import_stmt)
            print_success(import_stmt)
        except ImportError as e:
            print_error(f"{import_stmt} - {e}")
            return False
    
    return True

def check_routes():
    """Verify all API routes are registered."""
    print_header("ROUTE REGISTRATION CHECK")
    
    try:
        from app.main import app
        
        routes = {}
        for route in app.routes:
            if hasattr(route, 'path') and hasattr(route, 'methods'):
                methods = sorted(route.methods - {'OPTIONS', 'HEAD'})
                if route.path not in ['openapi.json', '/docs', '/docs/oauth2-redirect', '/redoc']:
                    routes[route.path] = methods
        
        expected_routes = {
            '/health': {'GET'},
            '/analyze': {'POST'},
            '/status/{job_id}': {'GET'},
            '/admin/jobs': {'GET'},
            '/admin/job/{job_id}': {'GET'},
        }
        
        for path, methods in expected_routes.items():
            if path in routes and methods == set(routes[path]):
                print_success(f"{' '.join(sorted(methods)):6} {path}")
            else:
                print_error(f"Route not found or methods mismatch: {path}")
                return False
        
        return True
    
    except Exception as e:
        print_error(f"Failed to check routes: {e}")
        return False

def check_job_manager():
    """Verify job manager functionality."""
    print_header("JOB MANAGER FUNCTIONALITY CHECK")
    
    try:
        from app.core.job_manager import JobManager
        
        jm = JobManager()
        
        # Test create
        job_id = jm.create_job("https://github.com/test/repo")
        print_success(f"Created job: {job_id[:8]}...")
        
        # Test get
        job = jm.get_job(job_id)
        if job and job.status == "processing":
            print_success(f"Retrieved job with status: {job.status}")
        else:
            print_error("Failed to retrieve job")
            return False
        
        # Test update
        jm.update_job(job_id, "completed", path="/test/path")
        job = jm.get_job(job_id)
        if job.status == "completed" and job.path == "/test/path":
            print_success(f"Updated job status: {job.status}")
        else:
            print_error("Failed to update job")
            return False
        
        # Test get_all
        all_jobs = jm.get_all_jobs()
        if job_id in all_jobs:
            print_success(f"Retrieved all jobs: {len(all_jobs)} total")
        else:
            print_error("Failed to retrieve all jobs")
            return False
        
        return True
    
    except Exception as e:
        print_error(f"Job manager check failed: {e}")
        return False

def check_validation():
    """Verify URL validation."""
    print_header("URL VALIDATION CHECK")
    
    try:
        from app.services.repo_service import validate_github_url
        
        valid_urls = [
            "https://github.com/django/django",
            "https://github.com/python/cpython",
            "https://github.com/a/b",
        ]
        
        invalid_urls = [
            "https://gitlab.com/user/repo",
            "http://github.com/user/repo",
            "github.com/user/repo",
            "https://github.com/user",
            "",
        ]
        
        for url in valid_urls:
            if validate_github_url(url):
                print_success(f"Valid: {url}")
            else:
                print_error(f"Should be valid: {url}")
                return False
        
        for url in invalid_urls:
            if not validate_github_url(url):
                print_success(f"Invalid (correctly rejected): {url}")
            else:
                print_error(f"Should be invalid: {url}")
                return False
        
        return True
    
    except Exception as e:
        print_error(f"Validation check failed: {e}")
        return False

def check_requirements():
    """Verify requirements.txt has necessary dependencies."""
    print_header("REQUIREMENTS CHECK")
    
    try:
        backend_dir = Path(__file__).parent
        req_file = backend_dir / "requirements.txt"
        
        with open(req_file) as f:
            requirements = f.read()
        
        required_packages = ["fastapi", "uvicorn", "pydantic"]
        
        for package in required_packages:
            if package in requirements:
                print_success(f"{package} in requirements.txt")
            else:
                print_error(f"{package} not found in requirements.txt")
                return False
        
        return True
    
    except Exception as e:
        print_error(f"Requirements check failed: {e}")
        return False

def main():
    """Run all checks."""
    print_header("INFRALENS BACKEND VERIFICATION")
    
    checks = [
        ("File Structure", check_files_exist),
        ("Imports", check_imports),
        ("Routes", check_routes),
        ("Job Manager", check_job_manager),
        ("URL Validation", check_validation),
        ("Requirements", check_requirements),
    ]
    
    results = []
    
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print_error(f"Check '{name}' crashed: {e}")
            results.append((name, False))
    
    # Summary
    print_header("VERIFICATION SUMMARY")
    
    total = len(results)
    passed = sum(1 for _, result in results if result)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:10} {name}")
    
    print("\n" + "=" * 70)
    print(f"  {passed}/{total} checks passed")
    print("=" * 70)
    
    if passed == total:
        print_success("All checks passed! Backend is ready.")
        print_info("To start the server, run:")
        print_info("  cd backend")
        print_info("  uvicorn app.main:app --reload --port 8000")
        return 0
    else:
        print_error("Some checks failed. Please review the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
