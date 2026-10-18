Write-Host "Starting Alzheimer's Disease Detection App..." -ForegroundColor Cyan
Set-Location backend
Write-Host "Installing/Updating backend dependencies..." -ForegroundColor Yellow
if (Test-Path "..\venv\Scripts\pip.exe") {
    ..\venv\Scripts\pip.exe install -r requirements.txt
} else {
    pip install -r requirements.txt
}
Write-Host "Starting FastAPI server..." -ForegroundColor Green
if (Test-Path "..\venv\Scripts\python.exe") {
    ..\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
} else {
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
}
