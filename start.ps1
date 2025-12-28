# Start Social Dashboard Application

Write-Host "Starting Social Dashboard..." -ForegroundColor Cyan

# Function to check if a process is running on a specific port
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check if backend is already running
if (Test-Port 5000) {
    Write-Host "Backend is already running on port 5000" -ForegroundColor Yellow
} else {
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
    Start-Sleep -Seconds 3
}

# Check if frontend is already running
if (Test-Port 3000) {
    Write-Host "Frontend is already running on port 3000" -ForegroundColor Yellow
} else {
    Write-Host "Starting frontend server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
}

Start-Sleep -Seconds 2

Write-Host "`nApplication started!" -ForegroundColor Green
Write-Host "`nAccess your application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000/api" -ForegroundColor White
Write-Host "`nPress Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
