#!/usr/bin/env bash
set -eu

git diff --name-only | xargs -L 1 -I {} basename {} \;