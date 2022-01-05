#!/usr/bin/env bash
set -eu

./scripts/install.sh

dbg-swc reduce-min --build 'rm -rf .next && npx next build' --test 'dbg-swc grab-console http://localhost:3000 --script test.js --start "npm start"' $@