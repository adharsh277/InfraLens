# 🧪 InfraLens Backend - Testing Guide

This guide provides complete instructions for testing the Phase 2 backend API.

---

## 🚀 Setup for Testing

### 1. Start the Backend Server

```bash
cd /workspaces/InfraLens/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Keep Server Running

Leave the server running in a terminal while you test. You can open another terminal for running test commands.

---

## ✅ Test 1: Health Check

**Purpose**: Verify the server is running

```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status": "ok"}
```

**Status Code:** `200 OK`

---

## ✅ Test 2: Create Analysis Job - Valid URL

**Purpose**: Submit a GitHub repository for analysis

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/django/django"}'
```

**Expected Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

**Status Code:** `202 Accepted`

**Key Points:**
- Returns immediately (< 100ms)
- Job ID will be unique (different every time)
- Status is always "processing" initially

---

## ✅ Test 3: Check Job Status - Processing

**Purpose**: Poll the job status while it's processing

```bash
# Replace the job_id with the one from Test 2
curl http://localhost:8000/status/550e8400-e29b-41d4-a716-446655440000
```

**Expected Response (while processing):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "repo_url": "https://github.com/django/django",
  "path": null,
  "error": null,
  "created_at": "2026-04-23T12:00:00.123456",
  "completed_at": null
}
```

**Status Code:** `200 OK`

**Key Points:**
- `path` is null (clone still in progress)
- `error` is null (no error yet)
- `completed_at` is null

---

## ✅ Test 4: Wait and Check Job Status - Completed

**Purpose**: Verify job completes successfully

```bash
# Wait 10-30 seconds depending on repo size, then check again
sleep 20
curl http://localhost:8000/status/550e8400-e29b-41d4-a716-446655440000
```

**Expected Response (after completion):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo_url": "https://github.com/django/django",
  "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
  "error": null,
  "created_at": "2026-04-23T12:00:00.123456",
  "completed_at": "2026-04-23T12:00:25.654321"
}
```

**Key Points:**
- `status` changed from "processing" to "completed"
- `path` is now populated with the repository location
- `error` is still null
- `completed_at` is now set

### Verify Physical Files

```bash
# List the cloned repository
ls -la temp_repos/550e8400-e29b-41d4-a716-446655440000/

# Should show Django repo contents
# .git, README.md, setup.py, etc.
```

---

## ✅ Test 5: Admin - List All Jobs

**Purpose**: View all submitted jobs and their statuses

```bash
curl http://localhost:8000/admin/jobs
```

**Expected Response:**
```json
{
  "total": 1,
  "jobs": {
    "550e8400-e29b-41d4-a716-446655440000": {
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "repo_url": "https://github.com/django/django",
      "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
      "error": null,
      "created_at": "2026-04-23T12:00:00.123456",
      "completed_at": "2026-04-23T12:00:25.654321"
    }
  }
}
```

**Status Code:** `200 OK`

---

## ✅ Test 6: Admin - Get Job Details

**Purpose**: Get detailed information about a specific job

```bash
curl http://localhost:8000/admin/job/550e8400-e29b-41d4-a716-446655440000
```

**Expected Response:**
```json
{
  "job": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "repo_url": "https://github.com/django/django",
    "path": "temp_repos/550e8400-e29b-41d4-a716-446655440000",
    "error": null,
    "created_at": "2026-04-23T12:00:00.123456",
    "completed_at": "2026-04-23T12:00:25.654321"
  }
}
```

---

## ❌ Test 7: Invalid GitHub URL

**Purpose**: Verify URL validation is working

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://invalid.com/repo"}'
```

**Expected Response:**
```json
{
  "detail": "Invalid GitHub URL. Must be a public repository URL starting with https://github.com/"
}
```

**Status Code:** `400 Bad Request`

### Other Invalid URLs to Test

```bash
# Missing https://
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "github.com/user/repo"}'

# HTTP instead of HTTPS
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "http://github.com/user/repo"}'

# GitLab instead of GitHub
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://gitlab.com/user/repo"}'

# Incomplete path
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/user"}'
```

---

## ❌ Test 8: Job Not Found

**Purpose**: Verify 404 handling

```bash
curl http://localhost:8000/status/nonexistent-job-id-12345
```

**Expected Response:**
```json
{
  "detail": "Job nonexistent-job-id-12345 not found"
}
```

**Status Code:** `404 Not Found`

---

## ❌ Test 9: Clone Failure (Private Repo Simulation)

**Purpose**: Verify error handling for inaccessible repositories

```bash
# Note: GitHub premium private repos will fail authentication
# This test would need actual private repo URL
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/private/unavailable"}'
```

Then poll status - it should show `status: "failed"` with error message:

```json
{
  "job_id": "...",
  "status": "failed",
  "repo_url": "https://github.com/private/unavailable",
  "path": null,
  "error": "Failed to clone repository: repository not found",
  ...
}
```

---

## 🔄 Test 10: Concurrent Jobs

**Purpose**: Test non-blocking behavior with multiple repos

```bash
# Start 3 jobs
echo "Job 1:"
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/django/django"}' | jq .job_id

echo "Job 2:"
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/flask/flask"}' | jq .job_id

echo "Job 3:"
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/tornado/tornado"}' | jq .job_id

# All should respond in < 100ms
# Check status of all
curl http://localhost:8000/admin/jobs | jq .total
```

**Expected Behavior:**
- All 3 requests return immediately
- All 3 jobs shown in `/admin/jobs`
- All 3 clone operations happen in parallel

---

## 📊 Test 11: Load Testing with Script

**Purpose**: Test with multiple repositories

Create a test script:

```bash
#!/bin/bash

cat > /tmp/load_test.sh << 'EOF'
#!/bin/bash

repos=(
  "https://github.com/django/django"
  "https://github.com/flask/flask"
  "https://github.com/tornado/tornado"
  "https://github.com/fastapi/fastapi"
  "https://github.com/psf/requests"
)

echo "Submitting $((${#repos[@]})) jobs..."

job_ids=()
for repo in "${repos[@]}"; do
  echo "Submitting: $repo"
  response=$(curl -s -X POST http://localhost:8000/analyze \
    -H "Content-Type: application/json" \
    -d "{\"repo_url\": \"$repo\"}")
  
  job_id=$(echo "$response" | grep -o '"job_id":"[^"]*' | cut -d'"' -f4)
  job_ids+=("$job_id")
  
  echo "  Job ID: $job_id"
done

echo ""
echo "Waiting for jobs to complete..."
sleep 5

echo ""
echo "Job Summary:"
curl -s http://localhost:8000/admin/jobs | jq '.total'

echo ""
echo "All job IDs:"
for id in "${job_ids[@]}"; do
  status=$(curl -s http://localhost:8000/status/$id | jq -r '.status')
  echo "  $id: $status"
done
EOF

chmod +x /tmp/load_test.sh
bash /tmp/load_test.sh
```

---

## 🎯 Integration Test (Frontend Simulation)

Test the complete flow as the frontend would use it:

```bash
#!/bin/bash

echo "=== InfraLens Full Flow Test ==="
echo ""

# Step 1: Submit job
echo "1. Submitting analysis request..."
response=$(curl -s -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/django/django"}')

job_id=$(echo "$response" | jq -r '.job_id')
echo "   Job ID: $job_id"
echo "   Status: $(echo "$response" | jq -r '.status')"

# Step 2: Poll status
echo ""
echo "2. Polling job status..."
for i in {1..6}; do
  sleep 2
  status=$(curl -s http://localhost:8000/status/$job_id | jq -r '.status')
  echo "   Poll #$i: Status = $status"
  
  if [ "$status" = "completed" ] || [ "$status" = "failed" ]; then
    break
  fi
done

# Step 3: Get final result
echo ""
echo "3. Final job status:"
curl -s http://localhost:8000/status/$job_id | jq .

# Step 4: Verify repo was cloned
echo ""
echo "4. Verifying cloned repository..."
repo_path=$(curl -s http://localhost:8000/status/$job_id | jq -r '.path')
if [ ! -z "$repo_path" ] && [ "$repo_path" != "null" ]; then
  echo "   Repository location: $repo_path"
  echo "   Contents:"
  ls -1a "$repo_path" | head -10
fi

echo ""
echo "=== Test Complete ==="
```

---

## 📋 Verification Checklist

Run through this checklist to ensure everything works:

- [ ] Test 1: Health check returns 200 OK
- [ ] Test 2: Can create job, get non-empty job_id
- [ ] Test 3: Can check job status while processing
- [ ] Test 4: Job status changes to completed after clone finishes
- [ ] Test 5: Repository files exist in temp_repos directory
- [ ] Test 6: /admin/jobs shows all submitted jobs
- [ ] Test 7: /admin/job/{id} returns full job details
- [ ] Test 8: Invalid URLs rejected with 400 error
- [ ] Test 9: Non-existent job_id returns 404
- [ ] Test 10: Clone failures update job status to "failed"
- [ ] Test 11: Multiple concurrent jobs work without blocking
- [ ] Test 12: Frontend integration flow works end-to-end

---

## 📊 Performance Expectations

| Operation | Time | Notes |
|-----------|------|-------|
| POST /analyze | <100ms | Non-blocking, returns immediately |
| GET /status | <50ms | In-memory lookup |
| GET /admin/jobs | <100ms | Iterates all jobs |
| git clone (small) | 5-10s | Depends on repo size |
| git clone (large) | 30+ s | With --depth 1 optimization |

---

## 🔧 Debugging Tips

### Check Server Logs
Monitor the terminal where uvicorn is running for error messages:
```
INFO:     127.0.0.1:12345 - "POST /analyze HTTP/1.1" 202
ERROR - Unexpected error during clone: ...
```

### Verify Git Installation
```bash
which git
git --version
```

### Check Temp Storage
```bash
du -sh temp_repos/
ls -la temp_repos/
```

### Test Git Clone Manually
```bash
cd /tmp
git clone --depth 1 https://github.com/django/django test-repo
```

---

## 📚 Additional Resources

- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)
- **Backend Guide**: See `BACKEND.md`
- **Quick Start**: See `QUICKSTART.md`
- **Implementation**: See `IMPLEMENTATION.md`

---

**Happy testing! 🚀**
