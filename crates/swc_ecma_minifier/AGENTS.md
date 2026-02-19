### Instructions

- You can run execution tests by doing ./scripts/exec.sh to see if your changes are working.
- If an execution test fails, you are wrong.
- Always run execution tests after making changes.
- You can run fixture tests by doing ./scripts/test.sh, and you can do UPDATE=1 ./scripts/test.sh to update fixtures.

### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/terser, tests/mangle, tests/pass-1, tests/pass-default, tests/full, tests/projects, benches/full.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_minifier.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_minifier.
