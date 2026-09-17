@echo off
title MyFitDaily - Flutter Mobile App Runner

:: Kiem tra thu muc Mobile
if exist "%~dp0pubspec.yaml" (
    cd /d "%~dp0"
) else if exist "%~dp0Mobile\pubspec.yaml" (
    cd /d "%~dp0Mobile"
) else (
    echo [ERROR] Khong tim thay thu muc Mobile chua pubspec.yaml!
    pause
    exit /b 1
)

:start
cls
echo ========================================================
echo         MYFITDAILY - FLUTTER MOBILE APP RUNNER
echo ========================================================
echo Thu muc lam viec: %CD%
echo.
echo Chon moi truong ban muon khoi chay:
echo   [1] Chrome (Web) - Nhanh nhat, xem 3D tot nhat [Mac dinh]
echo   [2] Windows (Desktop App)
echo   [3] Edge (Web)
echo   [4] Tu dong nhan dien (Android Emulator / Dien thoai)
echo   [5] Cap nhat thu vien (flutter pub get)
echo   [6] Kiem tra danh sach thiet bi (flutter devices)
echo   [0] Thoat
echo ========================================================
echo.

set "choice="
set /p choice="Nhap lua chon cua ban (1-6, mac dinh 1): "
if not defined choice set choice=1
set choice=%choice: =%

if "%choice%"=="1" goto run_chrome
if "%choice%"=="2" goto run_windows
if "%choice%"=="3" goto run_edge
if "%choice%"=="4" goto run_auto
if "%choice%"=="5" goto pub_get
if "%choice%"=="6" goto check_devices
if "%choice%"=="0" goto end

echo Lua chon khong hop le! Dang khoi chay mac dinh tren Chrome...
goto run_chrome

:run_chrome
echo.
echo [+] Dang khoi chay MyFitDaily tren Google Chrome...
flutter run -d chrome
goto finish

:run_windows
echo.
echo [+] Dang khoi chay MyFitDaily tren Windows Desktop...
flutter run -d windows
goto finish

:run_edge
echo.
echo [+] Dang khoi chay MyFitDaily tren Microsoft Edge...
flutter run -d edge
goto finish

:run_auto
echo.
echo [+] Dang khoi chay tren thiet bi kha dung...
flutter run
goto finish

:pub_get
echo.
echo [+] Dang chay flutter pub get...
flutter pub get
echo.
echo [+] Hoan tat! Nhan phim bat ky de quay lai menu...
pause > nul
goto start

:check_devices
echo.
echo [+] Danh sach thiet bi hien co:
flutter devices
echo.
echo Nhan phim bat ky de quay lai menu...
pause > nul
goto start

:finish
echo.
echo ========================================================
echo Ung dung da dung. Nhan phim bat ky de thoat.
pause > nul
exit /b 0

:end
exit /b 0