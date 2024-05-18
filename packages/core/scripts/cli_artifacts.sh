#!/bin/sh

mkdir -p ./artifacts_cli
# Naive substitution to napi artifacts for the cli binary.
for filename in artifacts/*/*.node
do
  BINDING_NAME=${filename#*.}
  BINDING_ABI=${BINDING_NAME%%.*}
  CLI_BINARY_PATH=${filename%%.*}

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