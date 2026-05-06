@echo off
setlocal enabledelayedexpansion

cd /d "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

echo Configuring git...
git config user.email "mangi@example.com"
git config user.name "Claude Code"

echo Updating remote origin...
git remote remove origin 2>nul
git remote add origin "https://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@github.com/varennesmani8-coder/lumire-site.git"

echo Pushing to GitHub...
git push -u origin main --force

echo Done!
pause
