#!/bin/bash

cp -R ~/projects/TypeScript/tests/cases/conformance/ ./tests/conformance/
find ~/projects/TypeScript -name '*.errors.txt' -exec cp {} ~/projects/swc/typescript/checker/tests/reference/ \;
