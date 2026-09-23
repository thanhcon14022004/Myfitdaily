@echo off
title MYFITDAILY - Frontend Dev Server
color 0B

echo ======================================================================
echo             MYFITDAILY - KHOI DONG FRONTEND (PORT 5173)
echo ======================================================================
echo.

:: Giai phong port 5173 neu co tien trinh cu dang chiem
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do taskkill /f /pid %%a >nul 2>&1

cd /d "%~dp0frontend"

if not exist "%~dp0frontend\node_modules\" (
    echo.
    echo [THONG BAO] Thu vien Frontend chua duoc cai dat. Dang chay npm install...
    call npm install
    echo [OK] Da cai dat xong thu vien Frontend.
    echo.
)

echo [1/2] Dang mo trinh duyet web den http://localhost:5173 ...
start http://localhost:5173

echo [2/2] Dang khoi chay Vite Dev Server...
echo Nhan Ctrl + C de dung server khi muon.
echo.

npm run dev
