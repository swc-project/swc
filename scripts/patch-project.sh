#!/bin/bash

# Check if path argument is provided
if [ $# -eq 0 ]; then
    echo -e "\033[31mError\033[0m: Please provide a path to the directory containing \033[33mpackage.json\033[0m whose \033[33m@swc/core\033[0m dependency you want to patch"
    exit 1
fi

TARGET_DIR="$1"
CURRENT_DIR=$(pwd)

# Validate target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "\033[31mError\033[0m: Directory \033[33m$TARGET_DIR\033[0m does not exist"
    exit 1
fi

# Add patch section to Cargo.toml
echo '[patch.crates-io]' >> bindings/Cargo.toml
./scripts/cargo/patch-section.sh >> bindings/Cargo.toml

# Update cargo dependencies
cd bindings && cargo update -p swc_core -p swc_fast_ts_strip

# Return to original directory
cd "$CURRENT_DIR"

# Build the project
yarn build:dev

# Check if package.json exists in target directory
if [ ! -f "$TARGET_DIR/package.json" ]; then
    echo -e "\033[31mError\033[0m: \033[33mpackage.json\033[0m not found in \033[33m$TARGET_DIR\033[0m"
    exit 1
fi

# Check if @swc/core exists in package.json
if ! grep -q '"@swc/core"' "$TARGET_DIR/package.json"; then
    echo
    echo -e "\033[31mError\033[0m: \033[33m@swc/core\033[0m not found in \033[33mpackage.json\033[0m"
    echo
    echo "Please run the following commands:"
    echo
    if [ -f "$TARGET_DIR/yarn.lock" ]; then
        echo -e "    \033[32m$\033[0m cd $TARGET_DIR"
        echo -e "    \033[32m$\033[0m yarn add -D \033[33m@swc/core\033[0m"
    elif [ -f "$TARGET_DIR/package-lock.json" ]; then
        echo -e "    \033[32m$\033[0m cd $TARGET_DIR" 
        echo -e "    \033[32m$\033[0m npm install --save-dev \033[33m@swc/core\033[0m"
    elif [ -f "$TARGET_DIR/pnpm-lock.yaml" ]; then
        echo -e "    \033[32m$\033[0m cd $TARGET_DIR"
        echo -e "    \033[32m$\033[0m pnpm add -D @swc/core"
    else
        echo -e "    Please add \033[33m@swc/core\033[0m to your devDependencies and install using your package manager"
    fi
    echo
    echo "Then run:"
    echo
    echo -e "    \033[32m$\033[0m cd $CURRENT_DIR"
    echo -e "    \033[32m$\033[0m git restore bindings/Cargo.toml bindings/Cargo.lock"
    echo
    echo "After that, you can run this script again."
    exit 1
fi

# Update @swc/core in package.json
TEMP_FILE=$(mktemp)
sed 's#"@swc/core": "[^"]*"#"@swc/core": "'"$CURRENT_DIR"'/packages/core"#' "$TARGET_DIR/package.json" > "$TEMP_FILE"
mv "$TEMP_FILE" "$TARGET_DIR/package.json"

echo "Successfully patched @swc/core in $TARGET_DIR/package.json"