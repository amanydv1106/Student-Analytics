from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_RAW = BACKEND_DIR / "data" / "raw"
DATA_PROCESSED = BACKEND_DIR / "data" / "processed"
ARTIFACTS = BACKEND_DIR / "artifacts"
REPORTS = BACKEND_DIR / "reports"
FIGURES = REPORTS / "figures"

RANDOM_STATE = 42
N_STUDENTS = 200_000
