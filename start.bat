@echo off
echo Starting Alzheimer's Disease Detection App...
cd backend
echo Installing/Updating backend dependencies...
if exist "..\venv\Scripts\pip.exe" (
    ..\venv\Scripts\pip.exe install -r requirements.txt
) else (
    pip install -r requirements.txt
)
echo Starting FastAPI server...
if exist "..\venv\Scripts\python.exe" (
    ..\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
) else (
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
)
