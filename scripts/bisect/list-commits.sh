#!/usr/bin/env bash
set -eu

commits=$(git rev-list --ancestry-path $1...$2)

# Filter out commits made by `swc-bot`
filtered_commits=$(echo "$commits" | while read -r commit; do
    author=$(git show -s --format='%an' "$commit")
    if [[ "$author" != "SWC Bot" ]]; then
        echo "$commit"
    fi
done)

# Print the filtered commits
echo "$filtered_commits"
