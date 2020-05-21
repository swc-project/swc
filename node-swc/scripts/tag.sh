#!/usr/bin/env bash

set -eu

# Prevent me from tagging without comitting first.
git add -A || true
git commit || true

git push

git tag -d $1 || true
git push origin :$1 || true

git tag $1
git push --tags