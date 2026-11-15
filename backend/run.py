"""Backend Server Launcher for Student Success Prediction AI."""
import sys
from pathlib import Path
import uvicorn

# Ensure the root project directory is on sys.path so 'backend' package imports work cleanly
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if __name__ == "__main__":
    print("=" * 65)
    print("🎓 Starting Student Success Prediction & Early-Warning AI Server")
    print("   API Docs: http://localhost:8000/docs")
    print("   Web UI:   http://localhost:8000/")
    print("=" * 65)
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False)
