#!/usr/bin/env zsh
set -eu

find . -type d -empty -delete

export GIT_TRACE2_PERF_BRIEF=true
export GIT_TRACE2_PERF=/tmp/git-perf

rm -f $GIT_TRACE2_PERF

time git status -z -u
# time git status -uno
# git add -A


cat $GIT_TRACE2_PERF