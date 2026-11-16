from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]
ROOT_DIR = BACKEND_DIR.parent
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

ARTIFACTS_DIR = BACKEND_DIR / "artifacts"
REPORTS_DIR = BACKEND_DIR / "reports"
DATA_DIR = BACKEND_DIR / "data"

SCORE_MODEL_PATH = ARTIFACTS_DIR / "best_score_model.joblib"
RISK_MODEL_PATH = ARTIFACTS_DIR / "best_risk_model.joblib"

APP_TITLE = "StudIQ - Student Performance Analytics"
APP_VERSION = "2.0.0"
DEBUG = False

# Risk thresholds
RISK_THRESHOLD_SAFE = 0.35
RISK_THRESHOLD_WARNING = 0.50
