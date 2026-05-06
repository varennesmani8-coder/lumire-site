#!/usr/bin/env python3
"""
Push files to GitHub using the GitHub API
This bypasses the need for git command line
"""

import os
import json
import base64
import requests
from pathlib import Path

# Configuration
REPO_DIR = Path(r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site")
GITHUB_TOKEN = "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"
GITHUB_USER = "varennesmani8-coder"
GITHUB_REPO = "lumire-site"

API_BASE = "https://api.github.com"
REPO_URL = f"{API_BASE}/repos/{GITHUB_USER}/{GITHUB_REPO}"

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
}

def get_tree_sha():
    """Get the SHA of the main branch's tree"""
    try:
        resp = requests.get(
            f"{REPO_URL}/git/refs/heads/main",
            headers=HEADERS,
            timeout=10
        )
        if resp.status_code == 200:
            return resp.json()["object"]["sha"]
        # Try master branch
        resp = requests.get(
            f"{REPO_URL}/git/refs/heads/master",
            headers=HEADERS,
            timeout=10
        )
        if resp.status_code == 200:
            return resp.json()["object"]["sha"]
    except:
        pass
    return None

def create_blob(content):
    """Create a blob in GitHub"""
    data = {
        "content": base64.b64encode(content.encode()).decode(),
        "encoding": "base64"
    }
    resp = requests.post(
        f"{REPO_URL}/git/blobs",
        headers=HEADERS,
        json=data,
        timeout=10
    )
    if resp.status_code == 201:
        return resp.json()["sha"]
    raise Exception(f"Failed to create blob: {resp.text}")

def create_tree_entry(path, blob_sha):
    """Create a tree entry"""
    return {
        "path": path.replace("\\", "/"),
        "mode": "100644",
        "type": "blob",
        "sha": blob_sha
    }

def create_tree(tree_entries):
    """Create a tree"""
    data = {"tree": tree_entries}
    resp = requests.post(
        f"{REPO_URL}/git/trees",
        headers=HEADERS,
        json=data,
        timeout=10
    )
    if resp.status_code == 201:
        return resp.json()["sha"]
    raise Exception(f"Failed to create tree: {resp.text}")

def create_commit(tree_sha, message):
    """Create a commit"""
    data = {
        "message": message,
        "tree": tree_sha,
        "author": {
            "name": "Claude Code",
            "email": "mangi@example.com"
        }
    }
    resp = requests.post(
        f"{REPO_URL}/git/commits",
        headers=HEADERS,
        json=data,
        timeout=10
    )
    if resp.status_code == 201:
        return resp.json()["sha"]
    raise Exception(f"Failed to create commit: {resp.text}")

def update_ref(commit_sha, ref="main"):
    """Update the reference to point to the new commit"""
    data = {"sha": commit_sha, "force": True}
    resp = requests.patch(
        f"{REPO_URL}/git/refs/heads/{ref}",
        headers=HEADERS,
        json=data,
        timeout=10
    )
    if resp.status_code == 200:
        return True
    # Try to create the ref if it doesn't exist
    data = {"ref": f"refs/heads/{ref}", "sha": commit_sha}
    resp = requests.post(
        f"{REPO_URL}/git/refs",
        headers=HEADERS,
        json=data,
        timeout=10
    )
    if resp.status_code == 201:
        return True
    raise Exception(f"Failed to update ref: {resp.text}")

def push_files():
    """Push all files to GitHub"""
    print("=" * 70)
    print("GitHub API File Push")
    print("=" * 70)

    # Find all files to push (excluding .git)
    files_to_push = []
    for file_path in REPO_DIR.rglob("*"):
        if file_path.is_file() and ".git" not in str(file_path):
            rel_path = file_path.relative_to(REPO_DIR)
            files_to_push.append((file_path, rel_path))

    if not files_to_push:
        print("No files to push!")
        return False

    print(f"\nFound {len(files_to_push)} files to push")

    try:
        # Create blobs and tree entries
        print("\nCreating blobs...")
        tree_entries = []
        for file_path, rel_path in files_to_push:
            try:
                with open(file_path, "rb") as f:
                    content = f.read()
                # Try to decode as text, if fails, skip binary files
                try:
                    text_content = content.decode('utf-8')
                except:
                    print(f"  Skipping binary file: {rel_path}")
                    continue

                blob_sha = create_blob(text_content)
                tree_entries.append(create_tree_entry(rel_path, blob_sha))
                print(f"  ✓ {rel_path}")
            except Exception as e:
                print(f"  ✗ {rel_path}: {e}")

        if not tree_entries:
            print("No files could be added!")
            return False

        # Create tree
        print(f"\nCreating tree...")
        tree_sha = create_tree(tree_entries)
        print(f"✓ Tree created: {tree_sha}")

        # Create commit
        print(f"\nCreating commit...")
        commit_sha = create_commit(tree_sha, "Initial commit from Claude Code")
        print(f"✓ Commit created: {commit_sha}")

        # Update main branch
        print(f"\nUpdating main branch...")
        update_ref(commit_sha, "main")
        print(f"✓ Main branch updated")

        print("\n" + "=" * 70)
        print("SUCCESS! Files pushed to GitHub via API")
        print("=" * 70)
        print(f"\nRepository: https://github.com/{GITHUB_USER}/{GITHUB_REPO}")
        return True

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    import sys
    success = push_files()
    sys.exit(0 if success else 1)
