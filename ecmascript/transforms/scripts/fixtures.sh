#!/bin/bash

set -e

(cd fixtures && find . -depth -exec sh -c '
    for source; do
      case $source in ./*/*)
        target="$(printf %sz "${source#./}" | tr / -)";
        mv -i -- "$source" "${target%z}";;
      esac
    done
' _ {} +)
# (cd fixtures && for i in *-*;do mv $i ${i//"-"/"_"}; done)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

python3 $SCRIPT_DIR/fixtures.py