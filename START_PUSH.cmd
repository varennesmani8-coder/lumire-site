@echo off
cd /d "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
echo Starting GitHub push...
python final_github_push.py
if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! Push completed.
) else (
    echo.
    echo ERROR! Push failed with code %errorlevel%
)
pause
