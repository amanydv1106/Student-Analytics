from fastapi import APIRouter
from backend.app.schemas.reports import LeaderboardResponse
from backend.app.services.analytics import analytics_service

router = APIRouter(prefix="/api/models", tags=["Model Leaderboards"])

@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_model_leaderboard():
    """Get regression and classification leaderboard metrics, hyperparameter tuning results, and domain generalization."""
    return analytics_service.get_leaderboard()
