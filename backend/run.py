"""Backend Server Launcher for Student Success Prediction AI."""
import os
import sys
from pathlib import Path
import uvicorn

# Ensure the root project directory is on sys.path so 'backend' package imports work cleanly
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("=" * 65)
    print("🎓 Starting Student Success Prediction & Early-Warning AI Server")
    print(f"   Listening on: http://0.0.0.0:{port}")
    print(f"   API Docs:     http://localhost:{port}/docs")
    print("=" * 65)
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
