from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from .routers import upload, preprocess, predict

app = FastAPI(
    title="Alzheimer's Disease Detection API",
    description="API for classifying AD vs CN from MRI scans and providing XAI explanations.",
    version="1.0.0"
)

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(preprocess.router, prefix="/api", tags=["Preprocess"])
app.include_router(predict.router, prefix="/api", tags=["Predict"])

@app.get("/api/download")
async def download_file(path: str):
    file_path = Path(path)
    if not file_path.exists():
        return FileResponse(file_path, status_code=404)
    return FileResponse(
        file_path, 
        media_type='application/octet-stream', 
        filename=file_path.name
    )

# Mount Frontend
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Mount assets folder
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")
    
    # Catch-all to serve index.html for React Router
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        index_file = FRONTEND_DIST / "index.html"
        # Serve the requested file if it exists (e.g. vite.svg), else fallback to index.html
        requested_file = FRONTEND_DIST / full_path
        if requested_file.is_file():
            return FileResponse(requested_file)
        return FileResponse(index_file)
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Alzheimer's Disease Detection API. Frontend build not found. Please run 'npm run build' in the frontend directory."}
