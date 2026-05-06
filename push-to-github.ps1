# GitHub Push Script
$repoPath = "C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
$githubToken = "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"
$githubRepo = "https://varennesmani8-coder:$githubToken@github.com/varennesmani8-coder/lumire-site.git"

# Change to the repository directory
cd $repoPath

# Configure git user (if not already configured)
git config user.email "mangi@example.com"
git config user.name "Claude Code"

# Add the remote origin if not already present
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    git remote add origin $githubRepo
} else {
    git remote set-url origin $githubRepo
}

# Push to GitHub
git push -u origin master

Write-Host "Repository pushed successfully!"
