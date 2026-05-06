@echo off
cd /d "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRE\lumire-site"

REM Configure git user
git config user.email "mangi@example.com"
git config user.name "Claude Code"

REM Add or update the remote origin
git remote remove origin 2>nul
git remote add origin "https://varennesmani8-coder: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@github.com/varennesmani8-coder/lumire-site.git"

REM Push to GitHub
git push -u origin master

echo.
echo Push completed!
pause
