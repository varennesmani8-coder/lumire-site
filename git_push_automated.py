#!/usr/bin/env python3
"""
Automated Git Push Script for LUMIRE Repository
This script will configure git and push the local repository to GitHub
"""

import os
import subprocess
import sys

def run_command(cmd, cwd=None):
    """Execute a command and return the result"""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            shell=True
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def main():
    # Repository details
    repo_path = r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRE\lumire-site"
    github_token = "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"
    github_user = "varennesmani8-coder"
    github_repo = "lumire-site"

    print("=" * 60)
    print("LUMIRE Repository Push Automation")
    print("=" * 60)

    # Step 1: Verify repository exists
    print(f"\n1. Checking repository at: {repo_path}")
    if not os.path.exists(repo_path):
        print(f"ERROR: Repository directory not found at {repo_path}")
        return 1

    if not os.path.exists(os.path.join(repo_path, ".git")):
        print("ERROR: Not a git repository (missing .git directory)")
        return 1

    print("   OK: Git repository found")

    # Step 2: Configure git user
    print("\n2. Configuring git user...")
    rc, out, err = run_command("git config user.email mangi@example.com", repo_path)
    if rc == 0:
        print("   OK: Email configured")
    else:
        print(f"   WARNING: {err}")

    rc, out, err = run_command("git config user.name \"Claude Code\"", repo_path)
    if rc == 0:
        print("   OK: Username configured")
    else:
        print(f"   WARNING: {err}")

    # Step 3: Check for changes
    print("\n3. Checking for commits...")
    rc, out, err = run_command("git log --oneline -5", repo_path)
    if rc == 0:
        lines = out.strip().split('\n')
        print(f"   Found {len(lines)} recent commits:")
        for line in lines[:3]:
            print(f"     - {line}")
    else:
        print("   ERROR: Could not read git log")
        print(f"   {err}")

    # Step 4: Remove existing remote if present
    print("\n4. Setting up remote origin...")
    run_command("git remote remove origin", repo_path)

    # Step 5: Add remote with token
    remote_url = f"https://{github_user}:{github_token}@github.com/{github_user}/{github_repo}.git"
    rc, out, err = run_command(f'git remote add origin "{remote_url}"', repo_path)
    if rc == 0:
        print("   OK: Remote origin added")
    else:
        print(f"   ERROR: Failed to add remote")
        print(f"   {err}")
        return 1

    # Step 6: Push to GitHub
    print("\n5. Pushing to GitHub...")
    print("   (This may take a moment)")

    rc, out, err = run_command("git push -u origin master --force", repo_path)

    if rc == 0:
        print("   SUCCESS: Repository pushed to GitHub!")
        print(f"\n   Repository URL: https://github.com/{github_user}/{github_repo}")
        print(f"   Push Output:\n{out}")
        return 0
    else:
        print("   ERROR: Failed to push repository")
        print(f"   {err}")
        print(f"   {out}")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        print("\n" + "=" * 60)
        if exit_code == 0:
            print("✓ Push completed successfully!")
        else:
            print("✗ Push encountered errors")
        print("=" * 60)

        # Keep window open
        input("\nPress Enter to close...")
        sys.exit(exit_code)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        input("\nPress Enter to close...")
        sys.exit(1)
