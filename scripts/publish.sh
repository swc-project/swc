#!/usr/bin/env bash
set -eux


version="$1"


npm version "$version" --no-git-tag-version