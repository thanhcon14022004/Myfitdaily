@echo off
title MYFITDAILY - Frontend Dev Server
color 0B

echo ======================================================================
echo             MYFITDAILY - KHOI DONG FRONTEND (PORT 5173)
echo ======================================================================
echo.

cd /d "%~dp0frontend"

echo [1/2] Dang mo trinh duyet web den http://localhost:5173 ...
start http://localhost:5173

echo [2/2] Dang khoi chay Vite Dev Server...
echo Nhan Ctrl + C de dung server khi muon.
echo.

npm run dev
