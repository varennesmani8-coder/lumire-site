@echo off
REM LUMIRÉ Development Server and Test
REM Start Python HTTP server in background and open browser

cd /d "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

REM Start Python server in background
start /b python -m http.server 8000 --directory .

REM Wait a moment for server to start
timeout /t 2 /nobreak

REM Open browser
start http://localhost:8000

echo.
echo LUMIRÉ Development Server Started
echo Server: http://localhost:8000
echo Press Ctrl+C to stop the server
