# Compiler preset fixtures

Each fixture has an `input` directory and an `output` directory. The compiler
discovers `.swcrc` files from each input file using the normal configuration
lookup, including configurations shared by parent directories. Fixtures without
a `.swcrc` use the compiler defaults.

The runner compiles JavaScript and TypeScript inputs with external helpers
enabled and compares emitted code, source maps, diagnostics, and additional
outputs with the existing snapshots. Tests that need execution or specialized
assertions belong in their respective suites.

Feature directories group fixtures by the configuration they exercise. Issue
regressions whose configuration does not identify a single feature remain in
`regressions`. Integration fixtures keep their shared parent configurations
together under `integration`.
