@echo off
title MYFITDAILY - All-in-One Launcher
color 0A

echo ======================================================================
echo             MYFITDAILY - KHOI DONG HE THONG WEB ^& API
echo ======================================================================
echo.

:: 1. Khoi dong Backend .NET Web API
echo [1/3] Dang khoi dong Backend API (Port 5240)...
start "MYFITDAILY Backend API (Port 5240)" cmd /k "cd /d "%~dp0backend" && echo Dang chay Backend API... && dotnet run"

:: Cho 3 giay de Backend khoi tao cac service va ket noi database
timeout /t 3 /nobreak >nul

:: 2. Khoi dong Frontend React Vite
echo [2/3] Dang khoi dong Frontend React (Port 5173)...
start "MYFITDAILY Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && echo Dang chay Frontend React UI... && npm run dev"

:: Cho 2 giay de Vite dev server san sang
timeout /t 2 /nobreak >nul

:: 3. Tu dong mo trinh duyet truc tiep vao Giao dien Web
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
