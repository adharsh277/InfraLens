# InfraLens

> **AI-Powered Infrastructure Analysis & DevOps Automation Platform**

InfraLens is a modern SaaS platform that instantly understands your infrastructure, detects risks, and automates DevOps workflows with AI-generated insights.

## ✨ Features

- 🔍 **Infrastructure Graph Intelligence** - Visual analysis of your infrastructure components
- 🤖 **AI-Powered Automation Detection** - Automatically identify optimization opportunities
- ⚠️ **Risk Detection & Alerts** - Proactive security and performance analysis
- 🎨 **Modern Minimalist UI** - Clean, ash-silver themed interface with smooth animations
- ⚡ **Real-time Analysis** - Fast repository analysis with background processing
- 📊 **AI Visualizations** - AI-generated infrastructure and automation visualizations

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and interactions
- **Lucide React** - Icon library

### Backend
- **FastAPI 0.115.12** - High-performance Python API
- **Pydantic 2.11.3** - Data validation
- **Uvicorn 0.34.1** - ASGI server

## � Public Assets

The frontend uses AI-generated visualization images:
- **automationai.png** - AI automation intelligence visualization for DevOps section
- **ai.png** - AI Intelligence Visualization for live preview section
- **infra.png** - Infrastructure architecture preview (hero section)

Located in `/frontend/public/`

## �📂 Project Structure

```
InfraLens/
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── analyze/          # Repository analysis page
│   │   │   ├── result/           # Results dashboard
│   │   │   └── globals.css       # Global styles & animations
│   │   └── components/
│   │       ├── site/             # Landing page sections
│   │       │   ├── navbar.tsx
│   │       │   ├── hero.tsx
│   │       │   ├── devops-automation.tsx
│   │       │   ├── features.tsx
│   │       │   ├── workflow.tsx
│   │       │   └── ...
│   │       └── ui/               # Reusable UI components
│   │           └── button.tsx
│   └── package.json
│
└── backend/                       # FastAPI application
    ├── app/
    │   ├── main.py               # FastAPI app & endpoints
    │   ├── schemas.py            # Request/response models
    │   └── services/
    │       └── repo.py           # Repository analysis logic
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites
- Node.js 19.2.4+
- Python 3.12+
- Git

### Installation

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`

## 💻 Usage

1. **Visit Landing Page** - Navigate to `http://localhost:3000` to see the InfraLens interface
2. **Analyze Repository** - Enter a GitHub repository URL on the analyze page
3. **View Results** - Get detailed infrastructure analysis and recommendations

## 🎯 API Endpoints

### POST `/analyze`
Analyze a GitHub repository for infrastructure and automation opportunities.

**Request:**
```json
{
  "repo_url": "https://github.com/user/repo"
}
```

**Response:**
```json
{
  "status": "processing",
  "repo_url": "https://github.com/user/repo"
}
```

## 🎨 Design System

### Color Palette
- **Primary Background**: Ash Silver (`#4a4a4a`)
- **Dark Background**: Pure Black (`#000000`, `#0a0a0a`, `#0f0f0f`)
- **Text**: White (`#ffffff`)
- **Gradient**: Dark gray to black with subtle depth

### Key Components
- **Minimalist Design** - Removed blue accents, focus on clean ash-silver tones
- **AI Visualizations** - Integrated AI-generated infrastructure maps (automationai.png, ai.png)
- **Footer** - Comprehensive footer with social links:
  - GitHub
  - Twitter
  - LinkedIn
  - Instagram
  - Email
- **Animations** - Framer Motion for smooth component interactions
- **Responsive Layout** - Mobile-first design with Tailwind CSS

### Recent Design Updates
- ✅ Removed blue-flavored box structures
- ✅ Implemented ash-silver background color scheme
- ✅ Added AI visualization images
- ✅ Enhanced footer with social media links
- ✅ Minimalist component styling

## 🔧 Building for Production

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📋 Development

### Frontend Development
- Use `npm run dev` for development with hot reload
- TypeScript strict mode enabled
- ESLint configured for code quality

### Backend Development
- Use `--reload` flag with uvicorn for auto-restart on code changes
- Pydantic validation ensures type safety
- Background tasks for async operations

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Cloud Run / Lambda)
1. Build Docker image or deploy directly
2. Set environment variables
3. Connect to frontend API endpoint

## 📄 License

[Add your license here]

## 🙋 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for the DevOps community**