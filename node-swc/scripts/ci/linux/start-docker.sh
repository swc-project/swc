#!/bin/sh

# Starts our build image inside docker, if we're doing a docker build.

set -eux

docker build -t node-rust-$2 -f "scripts/ci/linux/Dockerfile" . --build-arg NODE_VERSION="$3"

# sleep so our detached container with no long running process sits around to accept commands for a bit
docker run --detach --name target-$2 -v "$(pwd)":/src -w /src node-rust-$2 sleep 999999999