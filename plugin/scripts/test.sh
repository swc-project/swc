#!/usr/bin/env bash

## This script assumes `plugins` is in `$CDPATH`

(cd plugins && cargo build && ls -al target/debug)
