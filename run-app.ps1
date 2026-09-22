Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "            MYFITDAILY - KHOI DONG HE THONG WEB & API" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# Giai phong port 5240 neu dang bi chiem
$backendPort = Get-NetTCPConnection -LocalPort 5240 -State Listen -ErrorAction SilentlyContinue
if ($backendPort) {
    Write-Host "Dang tat tien trinh cu tren Port 5240..." -ForegroundColor Yellow
    Stop-Process -Id $backendPort.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Giai phong port 5173 neu dang bi chiem
$frontendPort = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "Dang tat tien trinh cu tren Port 5173..." -ForegroundColor Yellow
    Stop-Process -Id $frontendPort.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Kiem tra thu vien Frontend
if (-not (Test-Path "$PSScriptRoot\frontend\node_modules")) {
    Write-Host "`n[THONG BAO] Chua cai dat thu vien Frontend! Dang chay npm install..." -ForegroundColor Yellow
    Start-Process cmd -ArgumentList "/c cd /d `"$PSScriptRoot\frontend`" && npm install" -Wait
    Write-Host "[OK] Da cai dat xong thu vien Frontend.`n" -ForegroundColor Green
}

Write-Host "`n[1/3] Dang khoi dong Backend API (Port 5240)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$PSScriptRoot\backend`" && dotnet run"

Start-Sleep -Seconds 3

Write-Host "[2/3] Dang khoi dong Frontend React (Port 5173)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$PSScriptRoot\frontend`" && npm run dev"

Start-Sleep -Seconds 2

Write-Host "[3/3] Dang mo trinh duyet Web giao dien chinh..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host " [THANH CONG] He thong MYFITDAILY dang hoat dong:" -ForegroundColor Green
Write-Host " - Giao dien Web:   http://localhost:5173" -ForegroundColor White
Write-Host " - Swagger API Doc: http://localhost:5240/swagger" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
