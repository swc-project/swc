### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/errors, tests/exec, tests/minify, tests/typescript, tests/vercel, tests/stacktrace, tests/babel-exec.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc.
- Verify without UPDATE before finishing: cargo test -p swc.
