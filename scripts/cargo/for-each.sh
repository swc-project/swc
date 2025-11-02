#!/usr/bin/env bash
set -euo pipefail

# Check if a command is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <command> [args...]"
    echo "Example: $0 cargo build --release"
    exit 1
fi

# Get the workspace root directory (where this script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "Searching for Cargo.lock files in: $WORKSPACE_ROOT"
echo "Command to execute: $*"
echo ""

# Find all Cargo.lock files and extract their directories
FOUND_PROJECTS=0
FAILED_PROJECTS=0

while IFS= read -r lockfile; do
    PROJECT_DIR="$(dirname "$lockfile")"
    PROJECT_NAME="$(basename "$PROJECT_DIR")"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Running in: $PROJECT_DIR"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    FOUND_PROJECTS=$((FOUND_PROJECTS + 1))
    
    # Execute the command in the project directory
    if (cd "$PROJECT_DIR" && "$@"); then
        echo "✅ Success in: $PROJECT_NAME"
    else
        echo "❌ Failed in: $PROJECT_NAME"
        FAILED_PROJECTS=$((FAILED_PROJECTS + 1))
    fi
    echo ""
done < <(find "$WORKSPACE_ROOT" -name "Cargo.lock" -type f | sort)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "  Total projects found: $FOUND_PROJECTS"
echo "  Successful: $((FOUND_PROJECTS - FAILED_PROJECTS))"
echo "  Failed: $FAILED_PROJECTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit with error if any project failed
if [ $FAILED_PROJECTS -gt 0 ]; then
    exit 1
fi

