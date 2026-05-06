@echo off
REM LUMIRE - Quick Vercel Deployment Script

cd /d "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRE\lumire-site"

echo.
echo ========================================
echo LUMIRE - VERCEL DEPLOYMENT
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
npm --version

echo.
echo [INFO] Installing Vercel CLI globally...
call npm install -g vercel >nul 2>&1

echo.
echo [INFO] Deploying to Vercel production...
echo.
call vercel --prod

if errorlevel 1 (
    echo.
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Site: https://lumire-site.vercel.app
echo.
pause
