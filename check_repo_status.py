#!/usr/bin/env python3
"""
Check the current status of the GitHub repository
"""
import json
from urllib.request import Request, urlopen

GITHUB_TOKEN = "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"
GITHUB_USER = "varennesmani8-coder"
GITHUB_REPO = "lumire-site"

def check_repo():
    """Check repository status"""
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python-Script"
    }

    url = f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}"
    req = Request(url, headers=headers)

    try:
        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))

            print("Repository Status:")
            print(f"  Name: {data.get('name', 'N/A')}")
            print(f"  Owner: {data.get('owner', {}).get('login', 'N/A')}")
            print(f"  URL: {data.get('html_url', 'N/A')}")
            print(f"  Description: {data.get('description', 'N/A')}")
            print(f"  Default Branch: {data.get('default_branch', 'N/A')}")
            print(f"  Pushed At: {data.get('pushed_at', 'Never')}")
            print(f"  Created At: {data.get('created_at', 'N/A')}")

            # Check if there are any commits
            commits_url = f"{url}/commits"
            commits_req = Request(commits_url, headers=headers)
            with urlopen(commits_req, timeout=10) as commits_response:
                commits_data = json.loads(commits_response.read().decode('utf-8'))
                if isinstance(commits_data, list):
                    print(f"  Total Commits: {len(commits_data)}")
                    if commits_data:
                        print(f"  Latest Commit: {commits_data[0].get('commit', {}).get('message', 'N/A')}")
                else:
                    print(f"  Status: Empty repository")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_repo()
