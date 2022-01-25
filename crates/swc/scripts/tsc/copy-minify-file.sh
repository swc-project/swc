#!/usr/bin/env bash
set -eu

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

name="$(basename $1)"

echo "Copying $name"


normal_file_path="tests/tsc-references/$(sed 's/2\.minified/1\.normal/' <<< $name)"
echo "Normal file: $normal_file_path"

cp $normal_file_path "$SCRIPT_DIR/../swc_ecma_minifier/tests/compress/fixture/tsc-spec/$name/input.js"

echo

