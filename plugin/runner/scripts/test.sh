#!/usr/bin/env bash
set -eu


export LD_LIBRARY_PATH=$(pwd)/../../target/release

echo $LD_LIBRARY_PATH

ls -al $LD_LIBRARY_PATH

cargo test