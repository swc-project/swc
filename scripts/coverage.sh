#!/bin/bash
set -eu

export CARGO_INCREMENTAL=0
export RUSTFLAGS="-Zprofile -Ccodegen-units=1 -Copt-level=0 -Clink-dead-code -Coverflow-checks=off -Zpanic_abort_tests"
export RUSTDOCFLAGS="-Cpanic=abort"

git clone https://github.com/swc-project/ts-parser-test-ref.git ecmascript/parser/tests/typescript/tsc

cargo test --no-run --all --all-features --exclude node-swc wasm
cargo test --all --all-features --exclude node-swc wasm

zip -0 ccov.zip `find . \( -name "swc*.gc*" -o -name 'ast_node*.gc*' -o -name 'enum_kind*.gc*' -o -name 'string-enum*.gc*' -o -name 'from_variant*.gc*' \) -print`;

grcov ccov.zip -s . -t lcov --llvm --branch --ignore-not-existing --ignore "/*" -o lcov.info;

bash <(curl -s https://codecov.io/bash) -f lcov.info