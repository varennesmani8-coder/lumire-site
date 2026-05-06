@echo off
REM Installation de Node.js et déploiement Vercel pour LUMIRÉ

echo.
echo ========================================
echo LUMIRE - Installation & Deployment
echo ========================================
echo.

REM Vérifier Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js non trouvé. Installation nécessaire...
    echo.
    echo Téléchargez Node.js depuis: https://nodejs.org/
    echo Puis réexécutez ce script.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js trouvé
node --version
echo.

REM Installer Vercel CLI
echo [*] Installation de Vercel CLI...
call npm install -g vercel
if %ERRORLEVEL% NEQ 0 (
    echo [!] Erreur lors de l'installation de Vercel
    pause
    exit /b 1
)

echo [OK] Vercel CLI installé
vercel --version
echo.

REM Changer de répertoire
cd /d "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

REM Déployer
echo [*] Déploiement sur Vercel...
echo.
call vercel --prod

echo.
echo ========================================
echo [OK] Déploiement complétée!
echo ========================================
echo.
pause
