import os
import sys

# Determine the base directory relative to this script
# Go two levels up to reach the MLModel directory
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'MLModel'))
sys.path.insert(0, basedir)

# Check the sys.path to confirm the correct path is added
print("Current sys.path:", sys.path)

# Attempt to import the DecisionTree module
try:
    from Classes.DecisionTree import DecisionTree  # Import from Classes
    print("Import successful!")
except ModuleNotFoundError as e:
    print("Import failed:", e)
