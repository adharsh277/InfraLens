from fastapi import BackgroundTasks, FastAPI, HTTPException

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.repo import analyze_repository

app = FastAPI(title="InfraLens API", version="0.1.0")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest, background_tasks: BackgroundTasks) -> AnalyzeResponse:
    try:
        background_tasks.add_task(analyze_repository, str(payload.repo_url))
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=500, detail="Failed to queue analysis") from exc

    return AnalyzeResponse(status="processing")
