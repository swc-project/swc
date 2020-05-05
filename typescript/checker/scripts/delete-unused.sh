#!/bin/bash

find tests/reference/ -name "*.symbols" -exec rm -rf {} \;
find tests/reference/ -name "*.types" -exec rm -rf {} \;
find tests/reference/ -name "*.js" -exec rm -rf {} \;