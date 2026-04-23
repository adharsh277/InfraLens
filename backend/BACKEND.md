# InfraLens Backend API - Phase 2

**Status**: Production-grade implementation with job management, async processing, and admin layer.

## 📋 Overview

This is a production-structured FastAPI backend for InfraLens that handles:
- ✅ Repository validation and ingestion
- ✅ Non-blocking background cloning via UUID-tracked jobs
- ✅ Job status tracking (in-memory)
- ✅ Admin endpoints for debugging

## 🏗️ Architecture

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization + middleware
│   ├── api/
│   │   ├── analyze.py          # POST /analyze, GET /status/{job_id}
│   │   └── admin.py            # GET /admin/jobs, GET /admin/job/{job_id}
│   ├── services/
│   │   ├── repo_service.py     # Git clone + validation logic
│   │   └── repo.py             # Legacy (kept for reference)
│   ├── core/
│   │   └── job_manager.py      # In-memory job storage & state
│   └── models/
│       └── schemas.py          # Pydantic request/response models
├── temp_repos/                 # Cloned repository storage
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🔌 API Endpoints

### Public API

#### **POST /analyze** (HTTP 202)
Create analysis job for a GitHub repository.

**Request:**
```json
{
  "repo_url": "https://github.com/user/repo"
}
```

**Response (202 Accepted):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

**Returns immediately** — cloning happens in background.

---

#### **GET /status/{job_id}**
Poll job status and metadata.

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo_url": "https://github.com/user/repo",
  "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
  "error": null,
  "created_at": "2026-04-23T12:00:00",
  "completed_at": "2026-04-23T12:05:00"
}
```

**Status values:** `processing`, `completed`, `failed`

---

#### **GET /health**
Simple health check.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Admin API

#### **GET /admin/jobs**
List all jobs with summary.

**Response:**
```json
{
  "total": 3,
  "jobs": {
    "job_id_1": { ... },
    "job_id_2": { ... },
    "job_id_3": { ... }
  }
}
```

---

#### **GET /admin/job/{job_id}**
Get full debug information for a specific job.

**Response:**
```json
{
  "job": {
    "job_id": "...",
    "status": "failed",
    "repo_url": "...",
    "path": null,
    "error": "Failed to clone repository: repository not found",
    "created_at": "...",
    "completed_at": "..."
  }
}
```

---

## 🚀 Running the Backend

### Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Start development server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Test endpoints
```bash
# Check health
curl http://localhost:8000/health

# Create analysis job
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/django/django"}'

# Check job status
curl http://localhost:8000/status/550e8400-e29b-41d4-a716-446655440000

# List all jobs
curl http://localhost:8000/admin/jobs

# Get job details
curl http://localhost:8000/admin/job/550e8400-e29b-41d4-a716-446655440000
```

---

## 🧠 Core Components

### 1. Job Manager (`app/core/job_manager.py`)

In-memory job storage with CRUD operations:
```python
from app.core.job_manager import job_manager

# Create job
job_id = job_manager.create_job("https://github.com/user/repo")

# Get job
job = job_manager.get_job(job_id)

# Update status
job_manager.update_job(job_id, "completed", path="/path/to/repo")

# List all
all_jobs = job_manager.get_all_jobs()
```

**Data Structure:**
```python
@dataclass
class Job:
    job_id: str
    repo_url: str
    status: str              # "processing" | "completed" | "failed"
    path: Optional[str]      # Path to cloned repo
    error: Optional[str]     # Error message if failed
    created_at: str          # ISO timestamp
    completed_at: Optional[str]
```

### 2. Repo Service (`app/services/repo_service.py`)

Handles Git operations and validation:

```python
from app.services.repo_service import clone_repo, validate_github_url

# Validate URL format
if validate_github_url(url):
    # Clone with shallow clone (--depth 1)
    path = clone_repo(url, job_id)
```

**Features:**
- ✅ Validates GitHub URL format (must start with `https://github.com/`)
- ✅ Shallow clone (`--depth 1`) to minimize storage
- ✅ 60-second timeout
- ✅ Comprehensive error handling with logging
- ✅ Cleanup function for repo deletion

### 3. Analyze Endpoint (`app/api/analyze.py`)

Orchestrates the analysis workflow:

```python
@router.post("/analyze")
def analyze(payload: AnalyzeRequest, background_tasks: BackgroundTasks):
    # 1. Validate URL
    # 2. Create job + job_id
    # 3. Queue background task (non-blocking)
    # 4. Return immediately with job_id
```

**Background Task:**
```python
def process_repo_background(job_id, repo_url):
    # Executes in background thread
    # Updates job status as it progresses
```

### 4. Admin Endpoints (`app/api/admin.py`)

Debugging and monitoring:
- `/admin/jobs` — List all jobs
- `/admin/job/{job_id}` — Full job details including errors

---

## 🔐 Validation & Safety

### URL Validation
```python
def validate_github_url(repo_url: str) -> bool:
    """
    ✓ Must start with: https://github.com/
    ✓ Must have at least: owner/repo
    ✗ Rejects private repos (automatic via git auth)
    """
```

### Error Handling
- ✅ Invalid GitHub URL → HTTP 400
- ✅ Job not found → HTTP 404
- ✅ Git clone timeout → Job status: `failed` with error message
- ✅ Large repos → Shallow clone reduces risk

---

## 📊 Job Lifecycle

```
User submits /analyze
         ↓
   Validate URL
         ↓
   Create job_id (UUID)
         ↓
   Return job_id + "processing" (HTTP 202)
         ↓
   [Background] Clone repo (shallow)
         ↓
   Update job status → "completed"
         ↓
   Poll /status/{job_id} to check progress
         ↓
   Status = "completed" → repo ready in temp_repos/{job_id}
```

---

## 💾 Storage

### Temporary Repos Location
```
backend/temp_repos/
├── 550e8400-e29b-41d4-a716-446655440000/  # job_id_1
│   └── [cloned repo files]
├── f47ac10b-58cc-4372-a567-0e02b2c3d479/  # job_id_2
│   └── [cloned repo files]
└── ...
```

### Size Optimization
- **Shallow clone** (`--depth 1`) reduces size ~90%
- Storage is temporary (Phase 2)
- Cleanup strategy: delete after analysis (Phase 5)

---

## 🔄 Async/Non-Blocking Design

**Why background tasks?**
```
WITHOUT background tasks:
User sends /analyze
    ↓
Server starts cloning (blocks)
    ↓
User waits 30+ seconds
    ↓
Response finally sent
❌ Poor UX, slow API

WITH background tasks:
User sends /analyze
    ↓
Job created instantly
    ↓
Response sent in <100ms (HTTP 202)
    ↓
User polls /status/{job_id}
    ↓
Cloning happens in separate thread
✅ Fast API, good UX, scalable
```

---

## 📝 Logging

All operations are logged with structured messages:
```
INFO - InfraLens API started
INFO - Created job 550e8400-e29b-41d4-a716-446655440000 for https://github.com/user/repo
INFO - Successfully cloned https://github.com/user/repo to temp_repos/550e8400-e29b-41d4-a716-446655440000
INFO - Job 550e8400-e29b-41d4-a716-446655440000 completed successfully
```

---

## 🚦 Next Steps (Phase 3+)

- [ ] **Database** — Replace in-memory jobs with persistent storage (PostgreSQL)
- [ ] **Authentication** — Secure admin endpoints
- [ ] **Private Repos** — Support authenticated GitHub access
- [ ] **Repo Analysis** — Implement actual infrastructure parsing
- [ ] **Webhooks** — Optional async job completion notifications
- [ ] **Cleanup** — Auto-delete repos after analysis
- [ ] **Rate Limiting** — Prevent abuse
- [ ] **Monitoring** — Prometheus metrics

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI initialization, middleware setup |
| `app/api/analyze.py` | `/analyze` and `/status` endpoints |
| `app/api/admin.py` | Admin debugging endpoints |
| `app/services/repo_service.py` | Git clone + URL validation |
| `app/core/job_manager.py` | In-memory job storage |
| `app/models/schemas.py` | Pydantic request/response models |
| `requirements.txt` | Python dependencies |

---

## ✅ Quality Checklist

- ✅ Non-blocking background processing (FastAPI BackgroundTasks)
- ✅ UUID-based job tracking
- ✅ In-memory job database
- ✅ Clear separation of concerns (api, services, core)
- ✅ GitHub URL validation
- ✅ Shallow clone for size optimization
- ✅ Error handling with detailed messages
- ✅ Admin endpoints for debugging
- ✅ CORS middleware for frontend integration
- ✅ Structured logging
- ✅ Production-grade code organization
- ✅ No database required (Phase 2)

---

**Built for InfraLens Phase 2**
