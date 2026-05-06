Set-Location "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

$env:GIT_AUTHOR_NAME = "Claude Code"
$env:GIT_AUTHOR_EMAIL = "mangi@example.com"
$env:GIT_COMMITTER_NAME = "Claude Code"
$env:GIT_COMMITTER_EMAIL = "mangi@example.com"

Write-Host "Configuring git..."
git config user.email "mangi@example.com"
git config user.name "Claude Code"

Write-Host "Removing existing remote..."
git remote remove origin 2>$null

Write-Host "Adding new remote..."
$token = "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"
$remoteUrl = "https://${token}@github.com/varennesmani8-coder/lumire-site.git"
git remote add origin "$remoteUrl"

Write-Host "Checking git status..."
git status

Write-Host "Pushing to GitHub..."
git push -u origin main --force

Write-Host "Push completed!"
