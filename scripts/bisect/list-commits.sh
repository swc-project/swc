#!/usr/bin/env bash
set -eu

commits=$(git rev-list --ancestry-path $1...$2)

# Filter out commits made by the release bots: the legacy `swc-bot` account
# and the `swc-project-bot` GitHub App. The app is matched by its numeric user
# ID in the noreply email, so the filter keeps working after the app is renamed.
filtered_commits=$(echo "$commits" | while read -r commit; do
    author=$(git show -s --format='%an' "$commit")
    email=$(git show -s --format='%ae' "$commit")
    if [[ "$author" != "SWC Bot" && "$email" != 316843836+*@users.noreply.github.com ]]; then
        echo "$commit"
    fi
done)

# Print the filtered commits in `$hash: $title` format
echo "$filtered_commits" | while read -r commit; do
    title=$(git show -s --format='%s' "$commit")
    echo "$commit: $title"
done
