@echo off
title MYFITDAILY - All-in-One Launcher
color 0A

echo ======================================================================
echo             MYFITDAILY - KHOI DONG HE THONG WEB VA API
echo ======================================================================
echo.

:: 1. Giai phong port 5240 va 5173 neu co tien trinh cu dang chiem
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5240"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do taskkill /f /pid %%a >nul 2>&1

:: 2. Kiem tra thu vien node_modules cua Frontend
if not exist "%~dp0frontend\node_modules\" (
    echo [THONG BAO] Chua co thu vien Frontend. Dang chay npm install...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
    echo [OK] Da cai dat xong thu vien Frontend.
    echo.
)

:: 3. Khoi dong Backend .NET Web API (Port 5240)
echo [1/3] Dang khoi dong Backend API (Port 5240)...
start "MYFITDAILY Backend API (Port 5240)" cmd /k "cd /d "%~dp0backend" && echo Dang chay Backend API... && dotnet run"

:: Cho 3 giay bang ping (on dinh hon timeout)
ping -n 4 127.0.0.1 >nul

:: 4. Khoi dong Frontend React Vite (Port 5173)
echo [2/3] Dang khoi dong Frontend React (Port 5173)...
start "MYFITDAILY Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && echo Dang chay Frontend React UI... && npm run dev"

:: Cho 2 giay
ping -n 3 127.0.0.1 >nul

:: 5. Tu dong mo trinh duyet truc tiep vao Giao dien Web
echo [3/3] Dang mo trinh duyet web den giao dien chinh...
start http://localhost:5173

echo.
echo ======================================================================
echo  [THANH CONG] He thong MYFITDAILY dang chay:
echo.
echo  - Giao dien Web (Test truc tiep):  http://localhost:5173
echo  - Swagger Doc (Test API tho):      http://localhost:5240/swagger
echo.
echo  Cac cua so terminal dang hoat dong o che do background.
echo  Khi muon dung he thong, ban chi can dong cac cua so terminal do.
echo ======================================================================
echo.
pause
