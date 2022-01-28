#!/usr/bin/env bash
set -eu

# Work in .data directory
cd .data

git clone https://github.com/cdnjs/cdnjs.git --depth 1 || true

cd cdnjs