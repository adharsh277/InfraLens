# InfraLens Backend - Quick Start Guide

## 🚀 Installation & Running

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3. Open API Documentation
Visit in browser:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 📝 API Usage Examples

### Example 1: Create Analysis Job

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/django/django"}'
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

💡 **Note**: Returns immediately with HTTP 202 (Accepted)

---

### Example 2: Check Job Status

```bash
curl http://localhost:8000/status/550e8400-e29b-41d4-a716-446655440000
```

**Response (while processing):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "repo_url": "https://github.com/django/django",
  "path": null,
  "error": null,
  "created_at": "2026-04-23T12:00:00",
  "completed_at": null
}
```

**Response (after completion):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo_url": "https://github.com/django/django",
  "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
  "error": null,
  "created_at": "2026-04-23T12:00:00",
  "completed_at": "2026-04-23T12:05:00"
}
```

---

### Example 3: List All Jobs (Admin)

```bash
curl http://localhost:8000/admin/jobs
```

**Response:**
```json
{
  "total": 2,
  "jobs": {
    "550e8400-e29b-41d4-a716-446655440000": {
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "repo_url": "https://github.com/django/django",
      "status": "completed",
      "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
      "error": null,
      "created_at": "2026-04-23T12:00:00",
      "completed_at": "2026-04-23T12:05:00"
    },
    "f47ac10b-58cc-4372-a567-0e02b2c3d479": {
      "job_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "repo_url": "https://github.com/python/cpython",
      "status": "processing",
      "path": null,
      "error": null,
      "created_at": "2026-04-23T12:10:00",
      "completed_at": null
    }
  }
}
```

---

### Example 4: Get Detailed Job Info

```bash
curl http://localhost:8000/admin/job/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "job": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "repo_url": "https://github.com/django/django",
    "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
    "error": null,
    "created_at": "2026-04-23T12:00:00",
    "completed_at": "2026-04-23T12:05:00"
  }
}
```

---

### Example 5: Error Handling

**Invalid URL:**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://invalid.com/repo"}'
```

**Response (HTTP 400):**
```json
{
  "detail": "Invalid GitHub URL. Must be a public repository URL starting with https://github.com/"
}
```

**Job Not Found:**
```bash
curl http://localhost:8000/status/nonexistent-job-id
```

**Response (HTTP 404):**
```json
{
  "detail": "Job nonexistent-job-id not found"
}
```

---

## 🔄 Frontend Integration Example

### JavaScript/TypeScript (React example)

```typescript
// 1. Create analysis job
async function analyzeRepo(repoUrl: string) {
  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl })
  });
  
  const data = await response.json();
  return data.job_id;
}

// 2. Poll status
async function checkStatus(jobId: string) {
  const response = await fetch(`http://localhost:8000/status/${jobId}`);
  return await response.json();
}

// 3. Complete flow
async function analyzeWithPolling(repoUrl: string) {
  // Create job
  const jobId = await analyzeRepo(repoUrl);
  console.log(`Job created: ${jobId}`);
  
  // Poll status
  let status = 'processing';
  while (status === 'processing') {
    await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
    
    const job = await checkStatus(jobId);
    status = job.status;
    
    console.log(`Status: ${status}`);
  }
  
  if (status === 'completed') {
    console.log(`✓ Analysis complete`);
    console.log(`Repo path: ${job.path}`);
  } else {
    console.log(`✗ Analysis failed: ${job.error}`);
  }
}

// Usage
analyzeWithPolling('https://github.com/django/django');
```

---

## 📂 Storage Verification

After running analysis, check the cloned repository:

```bash
# List cloned repos
ls -la backend/temp_repos/

# Check repo contents
ls -la backend/temp_repos/550e8400-e29b-41d4-a716-446655440000/
```

You should see:
```
temp_repos/
├── 550e8400-e29b-41d4-a716-446655440000/
│   ├── .git/
│   ├── README.md
│   ├── setup.py
│   └── [other repo files]
```

---

## 🐛 Debugging

### Check server logs
Monitor the terminal where you ran `uvicorn` for request logs:

```
INFO:     127.0.0.1:52345 - "POST /analyze HTTP/1.1" 202 Accepted
INFO:     127.0.0.1:52346 - "GET /status/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1" 200 OK
INFO - Created job 550e8400-e29b-41d4-a716-446655440000 for https://github.com/django/django
INFO - Successfully cloned https://github.com/django/django to temp_repos/550e8400-e29b-41d4-a716-446655440000
```

### Use admin endpoints for debugging

```bash
# See all jobs
curl http://localhost:8000/admin/jobs

# Check job details (including errors)
curl http://localhost:8000/admin/job/{job_id}
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid GitHub URL" | Ensure URL starts with `https://github.com/` |
| "Failed to clone repository" | Check if repo exists and is public |
| Job stuck on "processing" | Check if `git` is installed: `which git` |
| "Address already in use" | Change port: `uvicorn ... --port 8001` |

---

## 🧪 Load Testing

Test with multiple repos:

```bash
#!/bin/bash
for repo in "django/django" "flask/flask" "tornado/tornado"; do
  echo "Submitting: https://github.com/$repo"
  curl -s -X POST http://localhost:8000/analyze \
    -H "Content-Type: application/json" \
    -d "{\"repo_url\": \"https://github.com/$repo\"}" | jq .
done

# Check all jobs
echo "All jobs:"
curl -s http://localhost:8000/admin/jobs | jq .total
```

---

## 📊 Performance Notes

- **Response time**: <100ms (HTTP 202)
- **Shallow clone time**: 5-30 seconds (depends on repo size)
- **Storage per repo**: ~50-500 MB (reduced with `--depth 1`)
- **Concurrent jobs**: Unlimited (limited by system resources)

---

## ✅ Production Checklist (Phase 3+)

- [ ] Replace in-memory jobs with PostgreSQL
- [ ] Add authentication to admin endpoints
- [ ] Implement job auto-cleanup after 24 hours
- [ ] Add rate limiting
- [ ] Add request validation middleware
- [ ] Setup monitoring/metrics
- [ ] Add graceful shutdown handler
- [ ] Configure CORS properly per environment

---

**Happy analyzing! 🚀**
