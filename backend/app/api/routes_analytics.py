from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from backend.app.schemas.reports import AnalyticsSummaryResponse
from backend.app.services.analytics import analytics_service
from backend.app.core.config import REPORTS_DIR

router = APIRouter(prefix="/api/analytics", tags=["EDA & Dataset Analytics"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary():
    """Get dataset profiling statistics, feature missing rates, and target distributions."""
    return analytics_service.get_analytics_summary()

@router.get("/figures/{filename}")
def get_figure(filename: str):
    """Retrieve saved distribution and analysis figure images."""
    fig_path = REPORTS_DIR / "figures" / filename
    if not fig_path.exists():
        raise HTTPException(status_code=404, detail="Figure not found.")
    return FileResponse(fig_path, media_type="image/png")
