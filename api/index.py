import os
import sys

# Ensure the root directory is in sys.path so we can import 'backend'
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app

# Vercel entrypoint
# The 'app' variable is imported and exposed here.
