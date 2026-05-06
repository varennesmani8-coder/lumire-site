#!/usr/bin/env python3
"""
Automatic Git Push Script
Pushes lumire-site to GitHub varennesmani8-coder/lumire-site
"""

import os
import subprocess
import sys
from pathlib import Path

# Configuration
REPO_DIR = Path(r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site")
GITHUB_TOKEN = "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"
GITHUB_USER = "varennesmani8-coder"
GITHUB_REPO = "lumire-site"

def run_git_command(cmd, cwd=None):
    """Run a git command and return success status"""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd or REPO_DIR,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        print(f"Command: {cmd}")
        if result.stdout:
            print(f"Output: {result.stdout}")
        if result.returncode != 0:
            print(f"Error: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception: {e}")
        return False

def main():
    print("=" * 70)
    print("Git Push Automation - LUMIRÉ Site")
    print("=" * 70)

    # Verify repo exists
    if not REPO_DIR.exists():
        print(f"ERROR: Repository directory not found: {REPO_DIR}")
        return False

    if not (REPO_DIR / ".git").exists():
        print(f"ERROR: Not a git repository: {REPO_DIR}")
        return False

    print(f"✓ Repository found: {REPO_DIR}")

    # Configure git
    print("\n1. Configuring git user...")
    if not run_git_command('git config user.email "mangi@example.com"'):
        return False
    if not run_git_command('git config user.name "Claude Code"'):
        return False
    print("✓ Git user configured")

    # Setup remote
    print("\n2. Setting up remote origin...")
    run_git_command('git remote remove origin')  # Remove if exists

    remote_url = f"https://{GITHUB_USER}:{GITHUB_TOKEN}@github.com/{GITHUB_USER}/{GITHUB_REPO}.git"
    if not run_git_command(f'git remote add origin "{remote_url}"'):
        return False
    print("✓ Remote origin configured")

    # Push to GitHub
    print("\n3. Pushing to GitHub...")
    print("This may take a moment...")

    if not run_git_command("git push -u origin main --force"):
        print("ERROR: Failed to push")
        return False

    print("\n" + "=" * 70)
    print("SUCCESS! Repository pushed to GitHub")
    print("=" * 70)
    print(f"\nRepository: https://github.com/{GITHUB_USER}/{GITHUB_REPO}")
    print("\nVercel will now detect the repository and deploy the site.")

    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\nFatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
