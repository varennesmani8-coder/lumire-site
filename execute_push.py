#!/usr/bin/env python3
"""
Execute the final_push.bat script
"""
import subprocess
import sys
import os

# Change to the repository directory
repo_dir = r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site"
os.chdir(repo_dir)

# Execute the batch file
try:
    result = subprocess.run(
        ["final_push.bat"],
        capture_output=True,
        text=True,
        timeout=60
    )
    print("STDOUT:")
    print(result.stdout)
    print("\nSTDERR:")
    print(result.stderr)
    print(f"\nReturn code: {result.returncode}")
except Exception as e:
    print(f"Error executing batch file: {e}")
    sys.exit(1)
