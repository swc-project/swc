#!/usr/bin/env bash

set -eu

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR

git checkout master
changed=0
git pull --dry-run | grep -q -v 'Already up-to-date.' && changed=1

if [ $changed = '0' ] ; then 
    echo 'Already up-to-date'
    exit 0
fi

$DIR/../coverage.sh