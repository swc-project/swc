#!/bin/sh

mkdir -p ./artifacts_cli
# Naive substitution to napi artifacts for the cli binary.
for filename in artifacts/*/*.node
do
  BINDING_NAME=${filename#*.}
  BINDING_ABI=${BINDING_NAME%%.*}
  CLI_BINARY_PATH=${filename%%.*}

  if [ -f "$CLI_BINARY_PATH" ]; then
      chmod +x $CLI_BINARY_PATH
      cp -v $CLI_BINARY_PATH ./artifacts_cli/$BINDING_ABI
      mv $CLI_BINARY_PATH ./scripts/npm/$BINDING_ABI
  elif [ -f "$CLI_BINARY_PATH.exe" ]; then
      cp -v $CLI_BINARY_PATH.exe ./artifacts_cli/$BINDING_ABI
      mv $CLI_BINARY_PATH.exe ./scripts/npm/$BINDING_ABI
  fi
done