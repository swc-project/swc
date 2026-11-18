### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/deno-exec.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_bundler.
- Verify without UPDATE before finishing: cargo test -p swc_bundler.
