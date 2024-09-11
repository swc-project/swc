#!/bin/sh
set -eu

mkdir -p ./artifacts_cli
# Naive substitution to napi artifacts for the cli binary.
for filename in artifacts/*/*.node
do
  # filename: artifacts/bindings-core-1.7.24-aarch64-apple-darwin/swc.darwin-arm64.node

  # BINDING_NAME: darwin-arm64.node
  # BINDING_ABI: darwin-arm64
  # CLI_BINARY_PATH: artifacts/bindings-core-1.7.24-aarch64-apple-darwin/swc

  BINDING_NAME=$(basename "$filename")
  BINDING_ABI=$(echo "$BINDING_NAME" | sed 's/swc\.\(.*\)\.node/\1/')
  CLI_BINARY_PATH=$(dirname "$filename")/swc

  echo "Preparing build artifacts:"
  echo "Binding name $BINDING_NAME"
  echo "Filename $filename"
  echo "Cli binary path $CLI_BINARY_PATH"

  if [ -f "$CLI_BINARY_PATH" ]; then
      chmod +x $CLI_BINARY_PATH
      mv -v $CLI_BINARY_PATH ./artifacts_cli/swc-$BINDING_ABI
  elif [ -f "$CLI_BINARY_PATH.exe" ]; then
      mv -v $CLI_BINARY_PATH.exe ./artifacts_cli/swc-$BINDING_ABI.exe
  fi
done