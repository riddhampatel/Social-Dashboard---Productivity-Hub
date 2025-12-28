# Installation Script for Social Dashboard

Write-Host "Starting Social Dashboard Setup..." -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`nChecking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "`nChecking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version
    Write-Host "MongoDB is installed" -ForegroundColor Green
} catch {
    Write-Host "MongoDB not found. Make sure MongoDB is installed or use MongoDB Atlas" -ForegroundColor Yellow
}

# Install Backend Dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Cyan
Set-Location backend
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "Backend dependencies installed" -ForegroundColor Green

# Install Frontend Dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend dependencies installed" -ForegroundColor Green

Set-Location ..

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your MongoDB connection string" -ForegroundColor White
Write-Host "2. Update backend/.env with your JWT secret" -ForegroundColor White
Write-Host "3. Start MongoDB (if running locally): mongod" -ForegroundColor White
Write-Host "4. Start backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "5. Start frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "`nApplication will be available at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "`nHappy coding!" -ForegroundColor Magenta
