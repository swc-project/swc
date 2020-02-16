#!/bin/sh

export RUSTFLAGS="-Zprofile -Ccodegen-units=1 -Cinline-threshold=0 -Clink-dead-code -Coverflow-checks=off -Zno-landing-pads"

cargo test --no-run
cargo test

zip -0 ccov.zip `find . \( -name "swc*.gc*" -o -name 'ast_node*' -o -name '*' -o -name 'enum_kind*' -o -name 'string-enum*' -o -name 'from_variant*' \) -print`;

grcov ccov.zip -s . -t lcov --llvm --branch --ignore-not-existing --ignore "/*" -o lcov.info;

bash <(curl -s https://codecov.io/bash) -f lcov.info;