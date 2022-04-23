#!/usr/bin/env bash
#
# 
set -eu

clear
echo "Checking if we can postpone $1"

dur="${1/\/input.js/}"
output="${1/input.js/output.js}"
terser_output="${1/input.js/output.terser.js}"

bat "tests/terser/compress/$1"
bat "tests/terser/compress/$output"
bat "tests/terser/compress/$terser_output"




echo "Is it fine to postpone this file?"
select yn in "Yes" "No"; do
  case $yn in
    Yes ) echo "$1" >> tests/postponed.txt; exit;;
    No ) git restore "$dir"; exit;;
  esac
done