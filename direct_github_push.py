#!/usr/bin/env python3
"""
Direct push to GitHub using GitHub API
This script bypasses git command line entirely
"""
import os
import sys
import json
import base64
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError

# Configuration
REPO_DIR = Path(r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site")
GITHUB_TOKEN = "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"
GITHUB_USER = "varennesmani8-coder"
GITHUB_REPO = "lumire-site"

API_BASE = "https://api.github.com"
REPO_URL = f"{API_BASE}/repos/{GITHUB_USER}/{GITHUB_REPO}"

def make_request(method, url, data=None):
    """Make an HTTP request to GitHub API"""
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Claude-Code"
    }

    req_data = None
    if data:
        req_data = json.dumps(data).encode('utf-8')

    req = Request(url, data=req_data, headers=headers, method=method)

    try:
        with urlopen(req, timeout=30) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except URLError as e:
        print(f"Request error: {e}")
        return None, None

def get_ref_sha(ref="main"):
    """Get the SHA of a ref"""
    status, data = make_request("GET", f"{REPO_URL}/git/refs/heads/{ref}")
    if status == 200:
        return data["object"]["sha"]
    return None

def get_commit_sha(sha):
    """Get commit details"""
    status, data = make_request("GET", f"{REPO_URL}/git/commits/{sha}")
    if status == 200:
        return data
    return None

def create_blob(content):
    """Create a blob"""
    data = {
        "content": base64.b64encode(content.encode('utf-8')).decode('utf-8'),
        "encoding": "base64"
    }
    status, response = make_request("POST", f"{REPO_URL}/git/blobs", data)
    if status == 201:
        return response["sha"]
    print(f"Failed to create blob: {response}")
    return None

def create_tree(tree_entries, base_tree=None):
    """Create a tree"""
    data = {"tree": tree_entries}
    if base_tree:
        data["base_tree"] = base_tree
    status, response = make_request("POST", f"{REPO_URL}/git/trees", data)
    if status == 201:
        return response["sha"]
    print(f"Failed to create tree: {response}")
    return None

def create_commit(tree_sha, message, parent_sha=None):
    """Create a commit"""
    data = {
        "message": message,
        "tree": tree_sha,
        "author": {
            "name": "Claude Code",
            "email": "mangi@example.com"
        }
    }
    if parent_sha:
        data["parents"] = [parent_sha]

    status, response = make_request("POST", f"{REPO_URL}/git/commits", data)
    if status == 201:
        return response["sha"]
    print(f"Failed to create commit: {response}")
    return None

def update_ref(commit_sha, ref="main"):
    """Update a ref"""
    data = {"sha": commit_sha, "force": True}
    status, response = make_request("PATCH", f"{REPO_URL}/git/refs/heads/{ref}", data)
    if status == 200:
        return True
    # Try to create the ref
    data = {"ref": f"refs/heads/{ref}", "sha": commit_sha}
    status, response = make_request("POST", f"{REPO_URL}/git/refs", data)
    if status == 201:
        return True
    print(f"Failed to update ref: {response}")
    return False

def push_files():
    """Push all files to GitHub"""
    print("=" * 70)
    print("GitHub API File Push - Direct Method")
    print("=" * 70)

    # Find all files (exclude .git and common build files)
    files_to_push = []
    exclude = {'.git', 'node_modules', '.venv', '__pycache__', '.pytest_cache'}

    for file_path in REPO_DIR.rglob("*"):
        if file_path.is_file():
            rel_path = file_path.relative_to(REPO_DIR)
            if not any(part in exclude for part in rel_path.parts):
                files_to_push.append((file_path, rel_path))

    print(f"Found {len(files_to_push)} files to push")

    if not files_to_push:
        print("No files to push!")
        return False

    try:
        # Create tree entries
        print("\nProcessing files...")
        tree_entries = []
        skipped = 0

        for file_path, rel_path in files_to_push:
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()

                # Try to decode as text
                try:
                    text_content = content.decode('utf-8')
                    blob_sha = create_blob(text_content)
                    if blob_sha:
                        tree_entries.append({
                            "path": str(rel_path).replace("\\", "/"),
                            "mode": "100644",
                            "type": "blob",
                            "sha": blob_sha
                        })
                        print(f"  ✓ {rel_path}")
                    else:
                        print(f"  ✗ {rel_path} - Failed to create blob")
                except UnicodeDecodeError:
                    print(f"  ⊘ {rel_path} (binary, skipped)")
                    skipped += 1
            except Exception as e:
                print(f"  ✗ {rel_path}: {e}")

        print(f"\nSkipped {skipped} binary files")

        if not tree_entries:
            print("No files could be added!")
            return False

        # Get parent commit
        print("\nFetching parent commit...")
        parent_sha = get_ref_sha("main")
        if not parent_sha:
            print("WARNING: Could not get parent commit, will create without parent")
            parent_sha = None
        else:
            print(f"Parent SHA: {parent_sha}")

        # Create tree
        print("\nCreating tree...")
        tree_sha = create_tree(tree_entries)
        if not tree_sha:
            return False
        print(f"✓ Tree created: {tree_sha}")

        # Create commit
        print("\nCreating commit...")
        commit_sha = create_commit(tree_sha, "Push from Claude Code - LUMIRÉ site files", parent_sha)
        if not commit_sha:
            return False
        print(f"✓ Commit created: {commit_sha}")

        # Update ref
        print("\nUpdating main branch...")
        if update_ref(commit_sha, "main"):
            print("✓ Main branch updated")
        else:
            return False

        print("\n" + "=" * 70)
        print("SUCCESS! Files pushed to GitHub")
        print("=" * 70)
        print(f"Repository: https://github.com/{GITHUB_USER}/{GITHUB_REPO}")
        print(f"Commit: {commit_sha}")
        return True

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = push_files()
    sys.exit(0 if success else 1)
