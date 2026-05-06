
# LUMIRÉ Development Server Starter
# This script starts a local Python HTTP server for testing

$siteDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $siteDir

Write-Host "Starting LUMIRÉ development server..." -ForegroundColor Cyan
Write-Host "Server will run at http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray

# Start the Python HTTP server
python -m http.server 8000 --directory .
