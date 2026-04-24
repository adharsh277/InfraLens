"""InfraLens Backend API - Phase 2"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analyze, admin

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="InfraLens API",
    version="0.2.0",
    description="Backend API for infrastructure analysis and visualization",
)

# Add CORS middleware FIRST (before routes) for frontend integration
# Allow all origins for now - can be restricted later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Simple health check endpoint."""
    return {"status": "ok"}


# Include routers
app.include_router(analyze.router)
app.include_router(admin.router)


# Startup event
@app.on_event("startup")
def startup_event() -> None:
    """Log startup information."""
    logger.info("InfraLens API started")


# Shutdown event
@app.on_event("shutdown")
def shutdown_event() -> None:
    """Log shutdown information."""
    logger.info("InfraLens API shutdown")
