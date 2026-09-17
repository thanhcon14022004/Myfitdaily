@echo off
title MyFitDaily - Fix Network & Firewall Block

echo ========================================================
echo        MYFITDAILY - KHOI PHUC KET NOI MANG VA DATABASE
echo ========================================================
echo Dang kiem tra quyen Administrator...

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [THONG BAO] Can quyen Administrator de xoa rule chan mang!
    echo Dang yeu cau quyen Administrator qua hop thoai UAC...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

echo.
echo [+] Dang go bo cac rule chan ket noi cua Firewall (Codex Sandbox)...
powershell -Command "Remove-NetFirewallRule -DisplayName 'codex_sandbox_offline_block*' -Verbose"

echo.
echo ========================================================
echo DA KHOI PHUC KET NOI MANG VA DATABASE THANH CONG!
echo ========================================================
echo Bay gio ban co the quay lai trinh duyet va bam Dang nhap.
echo.
pause