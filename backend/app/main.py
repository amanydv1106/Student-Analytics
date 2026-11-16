from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from backend.app.core.config import APP_TITLE, APP_VERSION, FRONTEND_DIST
from backend.app.core.database import init_db
from backend.app.api import routes_predict, routes_models, routes_analytics, routes_auth, routes_student

# Initialize database on startup
init_db()

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description="StudIQ: Student Performance Analytics & Early-Warning Diagnostic System."
)

# CORS configuration
ALLOWED_ORIGINS = [
    "https://student-analytics-vert.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(routes_auth.router)
app.include_router(routes_student.router)
app.include_router(routes_predict.router)
app.include_router(routes_models.router)
app.include_router(routes_analytics.router)

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "title": APP_TITLE,
        "version": APP_VERSION,
        "frontend_built": FRONTEND_DIST.exists()
    }

# Mount static frontend build if compiled
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend_spa(full_path: str):
        # Serve exact file if exists, else serve index.html for SPA routing
        target = FRONTEND_DIST / full_path
        if full_path and target.exists() and target.is_file():
            return FileResponse(target)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/", include_in_schema=False)
    def root_fallback():
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head><title>Student Success AI - API Server</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0b1728; color: #f3f7ff; padding: 40px; }
          .card { background: #111d31; border: 1px solid #263750; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
          a { color: #62a7ff; text-decoration: none; font-weight: bold; }
          code { background: #172a45; padding: 2px 6px; border-radius: 4px; }
        </style>
        </head>
        <body>
          <div class="card">
            <h2>🎓 Student Success AI Backend API</h2>
            <p>The backend API server is fully running and healthy.</p>
            <ul>
              <li><a href="/docs">Interactive Swagger API Documentation (/docs)</a></li>
              <li><a href="/health">System Health Check (/health)</a></li>
              <li><a href="/api/models/leaderboard">Model Leaderboards (/api/models/leaderboard)</a></li>
              <li><a href="/api/sample-students">Preset Student Profiles (/api/sample-students)</a></li>
            </ul>
          </div>
        </body>
        </html>
        """)
