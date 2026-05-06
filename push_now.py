#!/usr/bin/env python3
"""
Push lumire-site repository to GitHub
"""

import os
import subprocess
import sys

# Repository details
repo_path = r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
github_token = "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"
github_user = "varennesmani8-coder"
github_repo = "lumire-site"

print("Starting git push...")
os.chdir(repo_path)

try:
    # Configure git user
    print("1. Configuring git...")
    subprocess.run(["git", "config", "user.email", "mangi@example.com"], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Claude Code"], check=True, capture_output=True)

    # Remove existing remote
    print("2. Setting up remote...")
    try:
        subprocess.run(["git", "remote", "remove", "origin"], stderr=subprocess.DEVNULL, check=False)
    except:
        pass

    # Add remote
    remote_url = f"https://{github_user}:{github_token}@github.com/{github_user}/{github_repo}.git"
    subprocess.run(["git", "remote", "add", "origin", remote_url], check=True, capture_output=True)

    # Push to GitHub
    print("3. Pushing to GitHub...")
    result = subprocess.run(["git", "push", "-u", "origin", "master", "--force"], check=True, capture_output=True, text=True)

    print("SUCCESS! Files pushed to GitHub.")
    print(result.stdout)
    sys.exit(0)

except subprocess.CalledProcessError as e:
    print(f"ERROR: {e}")
    if e.stderr:
        print(f"Details: {e.stderr}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
