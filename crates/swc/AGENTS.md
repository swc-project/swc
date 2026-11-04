### Fixture Test Addition Guide

- Place compiler snapshot fixtures under tests/preset, grouped by feature. Each fixture uses an input directory, inherited `.swcrc` configuration, and an output directory; tests/preset.rs checks the emitted code, source maps, diagnostics, and additional outputs. Diagnostic fixtures use `output.swc-stderr` beside the input directory.
- Keep tests with runtime, configuration loading, project, or minifier-specific assertions in their dedicated suites.
- Other fixture roots in this crate include tests/exec, tests/minify, tests/stacktrace, and tests/babel-exec.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc.
- Verify without UPDATE before finishing: cargo test -p swc.
