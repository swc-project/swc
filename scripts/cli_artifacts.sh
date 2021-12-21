#!/bin/sh

# Naive substitution to napi artifacts for the cli binary.
for filename in artifacts/*/*.node
do
  BINDING_NAME=${filename#*.}
  BINDING_ABI=${BINDING_NAME%%.*}
  CLI_BINARY_PATH=${filename%%.*}

  if [ -f "$CLI_BINARY_PATH" ]; then
      mv $CLI_BINARY_PATH ./scripts/npm/$BINDING_ABI
  else
      mv $CLI_BINARY_PATH.exe ./scripts/npm/$BINDING_ABI
  fi
done