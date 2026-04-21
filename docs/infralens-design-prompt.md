# InfraLens Landing Page Prompt (v0 / Figma AI)

Design a modern, high-end SaaS web experience for an AI-powered DevOps product called **InfraLens**.

## Brand + Vibe
- Product: InfraLens (AI for infrastructure understanding)
- Audience: DevOps engineers, platform teams, SREs
- Tone: Premium SaaS, developer-first, clean but futuristic
- Look and feel: Similar design quality and motion depth to Harness.io, Vercel, Linear, and Stripe

## Visual Style
- Dark theme with premium glassmorphism
- Smooth gradients in purple, blue, cyan tones
- Subtle neon glow accents and layered depth
- Polished, animated, alive interface
- Soft shadows, blurred backdrops, floating elements
- Minimal but powerful visual hierarchy

## Color Palette
- Base background: #0B0F1A
- Primary gradient: purple -> blue -> cyan
- Accent glow: neon blue and violet
- Text: white and soft gray

## Typography
- Modern geometric sans for headings
- Clean, developer-friendly sans for body
- Strong contrast and spacing rhythm

## Page 1: Landing Page

### 1) Navbar
- Left logo text: InfraLens
- Links: Features, Docs, Pricing, GitHub
- Right CTA button: Try Now (glowing)

### 2) Hero Section
- Headline: Understand Your Infrastructure Instantly
- Subtext: Turn complex Terraform and Kubernetes repos into clear visual systems powered by AI
- Center interactive GitHub URL input box
- Primary CTA: Analyze Repo
- Animated gradient mesh or particles in the background
- Right-side animated architecture preview with nodes and glowing connection lines

### 3) Live Preview Section (must feel alive)
- Fake infrastructure graph visualization
- Node labels: EC2, S3, Kubernetes Pods, Database
- Dynamic line connections, pulse animations, glow, subtle flow movement

### 4) Features Section
- 3 glassmorphism cards with hover lift and glow
- Features:
  - Visualization
  - AI Explanation
  - Risk Detection
- Each card includes a small animated icon

### 5) Workflow Section
- Horizontal flow with animated arrows
- Steps:
  1. Paste GitHub Repo
  2. InfraLens scans code
  3. Visual graph generated
  4. AI explains system

### 6) Result Preview Section (empty state)
- Clean dashboard-like UI
- Placeholder graph canvas
- Message: No repo analyzed yet
- CTA: Analyze your first repo

### 7) Footer
- Minimal, dark, subtle gradient
- Branding + links

## Motion Requirements (important)
- Floating UI blocks
- Smooth hover transitions
- Glow effects on CTA buttons
- Subtle moving background effects
- Graph nodes pulsing and connection lines animating

## Responsive Requirements
- Must look premium on desktop and mobile
- Preserve spacing, typography hierarchy, and visual depth at all breakpoints

## Tech Target
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui component style
- Reusable components

## Output Required
- Full landing page UI
- Analyze Repo page
- Result page (empty state)
- Reusable UI components (Navbar, Hero, Input, CTA, sections)
