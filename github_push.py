#!/usr/bin/env python3
"""
LUMIRÉ GitHub Push Automation Script
Handles GitHub authentication, repository creation, and code push
"""

import os
import json
import subprocess
import sys
import getpass
from urllib.request import Request, urlopen
from urllib.error import HTTPError

def run_command(cmd, description):
    """Run a shell command and return output"""
    print(f"\n[*] {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=project_dir)
        if result.returncode != 0:
            print(f"[!] Error: {result.stderr}")
            return False
        print(f"[✓] {description} - Success")
        return True
    except Exception as e:
        print(f"[!] Error running command: {e}")
        return False

def create_github_repo(token, repo_name):
    """Create a GitHub repository via API"""
    print(f"\n[*] Creating GitHub repository '{repo_name}'...")

    url = "https://api.github.com/user/repos"
    data = json.dumps({
        "name": repo_name,
        "description": "LUMIRÉ - Headless e-commerce site powered by Shopify",
        "private": False,
        "auto_init": False,
    }).encode('utf-8')

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "LUMIRÉ-Automation"
    }

    try:
        req = Request(url, data=data, headers=headers, method='POST')
        response = urlopen(req)
        repo_info = json.loads(response.read().decode('utf-8'))

        print(f"[✓] Repository created successfully!")
        print(f"    URL: {repo_info['clone_url']}")
        return repo_info['clone_url']
    except HTTPError as e:
        error_data = e.read().decode('utf-8')
        error_json = json.loads(error_data)
        if 'already exists' in error_json.get('message', ''):
            print(f"[!] Repository already exists")
            # Try to get existing repo
            url_user = f"https://api.github.com/user/repos"
            req = Request(url_user, headers=headers)
            response = urlopen(req)
            repos = json.loads(response.read().decode('utf-8'))
            for repo in repos:
                if repo['name'] == repo_name:
                    print(f"[✓] Using existing repository: {repo['clone_url']}")
                    return repo['clone_url']
        print(f"[!] Error: {error_json.get('message', str(e))}")
        return None
    except Exception as e:
        print(f"[!] Error creating repository: {e}")
        return None

def push_to_github(clone_url, token):
    """Push code to GitHub repository"""
    print(f"\n[*] Pushing code to GitHub...")

    # Extract username and repo from clone URL
    parts = clone_url.replace('.git', '').split('/')
    repo_full_name = f"{parts[-2]}/{parts[-1]}"

    # Configure git remote with token authentication
    auth_url = clone_url.replace('https://', f'https://{token}@')

    commands = [
        (f'git remote add origin {auth_url}', "Adding git remote"),
        ('git branch -M main', "Renaming branch to main"),
        ('git push -u origin main', "Pushing code to GitHub"),
    ]

    for cmd, desc in commands:
        if not run_command(cmd, desc):
            return False

    print(f"\n[✓] Code pushed successfully!")
    print(f"    Repository: {repo_full_name}")
    print(f"    URL: https://github.com/{repo_full_name}")
    return True

def main():
    global project_dir
    project_dir = r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"

    print("=" * 60)
    print("LUMIRÉ GitHub Push Automation")
    print("=" * 60)

    # Check if already initialized
    if subprocess.run('git remote -v', shell=True, cwd=project_dir, capture_output=True).returncode == 0:
        output = subprocess.run('git remote -v', shell=True, cwd=project_dir, capture_output=True, text=True).stdout
        if 'origin' in output:
            print("[✓] Git remote 'origin' already configured")
            print(output)

            # Ask if user wants to push
            response = input("\nPush to existing remote? (y/n): ").lower()
            if response == 'y':
                run_command('git push -u origin main', "Pushing to existing remote")
                print("\n[✓] Done!")
                return
            else:
                return

    print("\nThis script will:")
    print("1. Ask for your GitHub Personal Access Token")
    print("2. Create a new GitHub repository")
    print("3. Push the LUMIRÉ code to GitHub")
    print()

    # Get GitHub token
    print("[!] You need a GitHub Personal Access Token:")
    print("    1. Go to: https://github.com/settings/tokens")
    print("    2. Click 'Generate new token'")
    print("    3. Select scopes: repo, delete_repo (optional)")
    print("    4. Copy the token and paste below")
    print()

    token = getpass.getpass("Enter GitHub Personal Access Token: ").strip()

    if not token:
        print("[!] No token provided. Exiting.")
        return

    # Get repository name
    repo_name = input("Enter repository name (default: lumire-site): ").strip()
    if not repo_name:
        repo_name = "lumire-site"

    print(f"\n[*] Using repository name: {repo_name}")

    # Create repository
    clone_url = create_github_repo(token, repo_name)
    if not clone_url:
        print("[!] Failed to create repository")
        return

    # Push code
    if push_to_github(clone_url, token):
        print("\n" + "=" * 60)
        print("DEPLOYMENT READY!")
        print("=" * 60)
        print(f"\nGitHub Repository: {clone_url.replace('.git', '')}")
        print("\nNext steps:")
        print("1. Go to https://vercel.com")
        print("2. Import the lumire-site repository")
        print("3. Deploy to Vercel")
        print("\nSee LAUNCH_READY.md for complete instructions")
        print("=" * 60)
    else:
        print("[!] Failed to push code")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[!] Cancelled by user")
    except Exception as e:
        print(f"\n[!] Unexpected error: {e}")
