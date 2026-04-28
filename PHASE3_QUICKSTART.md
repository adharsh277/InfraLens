# 🚀 Phase 3: Quick Start Guide

## ⚡ 30-Second Overview

Phase 3 adds **infrastructure parsing** to InfraLens:
- Extracts **Terraform** resources (AWS, etc.)
- Extracts **Kubernetes** objects (Deployments, Services, etc.)
- Extracts **Docker** configurations
- Displays them beautifully in the results page

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd /workspaces/InfraLens/backend

# Install new parser libraries
pip install python-hcl2==4.1.0 pyyaml==6.0.1

# Or install all requirements:
pip install -r requirements.txt
```

### 2. Start Backend

```bash
cd /workspaces/InfraLens/backend

# Run the FastAPI server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3. Start Frontend (New Terminal)

```bash
cd /workspaces/InfraLens/frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

You should see:
```
  ▲ Next.js 14.x
  - Local:        http://localhost:3000
```

## 🧪 Testing Phase 3

### Manual Test: Upload a Sample IaC Repo

1. **Open frontend**: http://localhost:3000
2. **Click "Analyze Repo"** if not on that page already
3. **Paste this URL**: `https://github.com/hashicorp/terraform-aws-voc`
4. **Click "Analyze Repo"**
5. **Wait 30-60 seconds** for analysis

### Expected Results

You should see:

```
📦 Terraform Resources
  - aws_s3_bucket → aws_voc_artifacts
  - aws_dynamodb_table → voc_executions
  - aws_iam_role → voc_exec_role

☸️ Kubernetes Resources
  (none, GitHub sample)

🐳 Docker Resources
  (none, GitHub sample)
```

### Test with Local Sample

Create a test repo with only Terraform:

```bash
mkdir -p ~/test-terraform
cd ~/test-terraform

# Create a simple Terraform file:
cat > main.tf << 'EOF'
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "HelloWorld"
  }
}

resource "aws_s3_bucket" "data" {
  bucket = "my-app-data"
}
EOF

# Initialize git repo
git init
git add main.tf
git commit -m "Initial commit"
```

Then test with this local repo (requires `file://` protocol support, or push to GitHub).

---

## 🔍 Testing API Directly

### Step 1: Create Analysis Job

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/terraform-aws-modules/terraform-aws-vpc"
  }'
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

### Step 2: Poll for Results

```bash
# Wait 5 seconds, then check status:
sleep 5
curl http://localhost:8000/status/550e8400-e29b-41d4-a716-446655440000
```

**Response (partial):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "repo_url": "https://github.com/terraform-aws-modules/terraform-aws-vpc",
  "analysis": {
    "success": true,
    "infrastructure": {
      "terraform": [
        {
          "type": "aws_instance",
          "name": "web",
          "file": "main.tf"
        },
        {
          "type": "aws_db_instance",
          "name": "postgres",
          "file": "database.tf"
        }
      ],
      "kubernetes": [],
      "docker": [],
      "total": 2
    }
  }
}
```

---

## 📊 Test Repos by Infrastructure Type

### Terraform Repos
- `https://github.com/terraform-aws-modules/terraform-aws-vpc`
- `https://github.com/hashicorp/terraform-starter-kit`

### Kubernetes Repos
- `https://github.com/kubernetes/examples`
- `https://github.com/kelseyhightower/kubernetes-the-hard-way`

### Docker Repos
- `https://github.com/dockersamples/example-voting-app`
- `https://github.com/docker/awesome-compose`

### Mixed (Recommended!)
- `https://github.com/adharsh277/InfraLens` (this repo!)

---

## ✅ Verify Everything Works

### Checklist:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can submit repo URL
- [ ] Polling starts (shows "Processing...")
- [ ] Results page shows Terraform resources
- [ ] Results page shows Kubernetes resources (if present)
- [ ] Results page shows Docker resources (if present)

### Troubleshooting:

**Issue**: `ModuleNotFoundError: No module named 'hcl2'`
```bash
pip install python-hcl2
```

**Issue**: `ModuleNotFoundError: No module named 'yaml'`
```bash
pip install pyyaml
```

**Issue**: Frontend shows "error" but backend is working
- Check browser console (F12 → Console tab)
- Check backend logs for errors
- Ensure backend is on port 8000, frontend on 3000

**Issue**: Analysis never completes (stuck on "Processing")
```bash
# Check backend logs for errors
# Restart backend
# Try a smaller repo (large repos take longer)
```

---

## 🎯 What to Look For

### In Terraform Section:
- ✓ Resource types extracted correctly (aws_instance, aws_s3_bucket, etc.)
- ✓ Resource names shown properly
- ✓ File paths link to source files
- ✓ Configuration details available (hover/click)

### In Kubernetes Section:
- ✓ Kind extracted (Deployment, Service, ConfigMap, etc.)
- ✓ Object names correct
- ✓ Namespace displayed (if not default)
- ✓ Labels shown

### In Docker Section:
- ✓ Dockerfile base images detected
- ✓ docker-compose services listed
- ✓ Ports mapped correctly
- ✓ Container names shown

---

## 📈 Performance Notes

- **Small repos** (< 100 files): 5-10 seconds
- **Medium repos** (100-1000 files): 10-30 seconds
- **Large repos** (1000+ files): 30-60 seconds

GitHub rate limiting may affect very large repos.

---

## 🚀 Next: Phase 4

Once Phase 3 is working well, Phase 4 will add:
- **Infrastructure graph visualization**
- **Resource dependency mapping**
- **Architecture diagrams**

---

## 💡 Tips

1. **Use small repos first** to verify setup works
2. **Check backend logs** if frontend shows errors
3. **Refresh page** if stuck
4. **Use different repos** to test different IaC types
5. **Check browser DevTools** (F12) for detailed error info

---

## 📞 Common Questions

**Q: Why is parsing slow?**
A: Large repos need to be cloned, then all files scanned. First time is slowest due to git clone.

**Q: Can I parse private repos?**
A: Not yet. Only public GitHub repos work. Private repos coming in Phase 5.

**Q: What if a repo has no infrastructure files?**
A: That's fine! Frontend gracefully handles empty infrastructure sections. Other analysis (languages, insights) still shown.

**Q: How much storage is used?**
A: Repos cloned to `backend/temp_repos/{job_id}/`. Auto-cleanup planned.

---

✅ **Ready? Go test it!** 🚀
