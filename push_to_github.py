#!/usr/bin/env python3
import os
import subprocess
import sys

# Repository details
repo_path = r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRE\lumire-site"
github_token = "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"
github_repo = f"https://varennesmani8-coder:{github_token}@github.com/varennesmani8-coder/lumire-site.git"

# Change to repository directory
os.chdir(repo_path)

try:
    # Configure git user
    print("Configuring git user...")
    subprocess.run(["git", "config", "user.email", "mangi@example.com"], check=True)
    subprocess.run(["git", "config", "user.name", "Claude Code"], check=True)

    # Check if remote exists and remove it
    print("Setting up remote origin...")
    try:
        subprocess.run(["git", "remote", "remove", "origin"], stderr=subprocess.DEVNULL)
    except:
        pass

    # Add remote origin
    subprocess.run(["git", "remote", "add", "origin", github_repo], check=True)

    # Push to GitHub
    print("Pushing to GitHub...")
    result = subprocess.run(["git", "push", "-u", "origin", "master"], check=True, capture_output=True, text=True)

    print("Success! Repository pushed to GitHub.")
    print("Output:", result.stdout)

except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
    print(f"stderr: {e.stderr}")
    sys.exit(1)
except Exception as e:
    print(f"Unexpected error: {e}")
    sys.exit(1)

input("\nPress Enter to close...")
