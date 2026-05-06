#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir(r"C:\Users\mangi\Documents\Agent Claude\Claude Code\Dropshipping\LUMIRÉ\lumire-site")
result = subprocess.run([sys.executable, "direct_github_push.py"], capture_output=False)
sys.exit(result.returncode)
