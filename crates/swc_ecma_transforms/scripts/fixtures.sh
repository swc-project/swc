#!/bin/bash

set -e

rm -rf /tmp/.swc
mkdir -p /tmp/.swc/fixtures

(cd fixtures && find . -depth -exec sh -c '
    for source; do
      case $source in ./*/*)
        target="$(printf %sz "${source#./}" | tr / _)";
        cp -r -- "$source" "/tmp/.swc/fixtures/${target%z}";;
      esac
    done
' _ {} +)
# (cd fixtures && for i in *-*;do mv $i ${i//"-"/"_"}; done)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

(cd /tmp/.swc && python3 $SCRIPT_DIR/fixtures.py)