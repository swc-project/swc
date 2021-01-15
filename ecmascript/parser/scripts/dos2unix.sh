#!/usr/bin/env bash

for x
do
    echo "Converting $x"
    mkdir -p $(dirname "tmp.$x")
    tr -d '\015' < "$x" > "tmp.$x"
    mv "tmp.$x" "$x"
done