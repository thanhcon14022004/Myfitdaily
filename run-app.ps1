Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "            MYFITDAILY - KHOI DONG HE THONG WEB & API" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

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
