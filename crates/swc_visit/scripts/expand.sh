#!/usr/bin/env bash
set -eu


cargo expand --features path --test fold > tests/expanded.rs