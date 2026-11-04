### Fixture Test Addition Guide

- Place compiler snapshot fixtures under tests/compile, grouped by feature. Each fixture uses an input directory, inherited `.swcrc` configuration, and an output directory; tests/compile.rs checks the emitted code, source maps, diagnostics, and additional outputs. Diagnostic fixtures use `output.swc-stderr` beside the input directory.
- Keep tests with runtime, custom pass, API-specific, or cross-compilation assertions in their dedicated suites. Configuration selection and project compilation belong in compile fixtures when their behavior can be expressed through `.swcrc` and snapshots.
- Other fixture roots in this crate include tests/exec, tests/minify, tests/srcmap (including stack traces), and tests/babel-exec.
- Compiler execution fixtures share tests/exec.rs. Keep compiler configuration in `.swcrc`; use `exec.json` only for target-matrix restrictions and reference-compilation overrides. See tests/exec/README.md for the execution and stdout comparison rules.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc.
- Verify without UPDATE before finishing: cargo test -p swc.
