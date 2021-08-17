# swc_css_parser

CSS parser for [the swc project](https://swc.rs)

# Structure

## tests

### `/tests/fuxture`

CSS -> Parsed ast -> JSON.

### `/tests/error`

Error reporting test.

### `/tests/identity`

These tests ensure that `input.css` and `input.explicit.css` is parsed identically.
These are copied from `esbuild`, by modifying the test suite.

# License

Apache 2.0 / MIT, at your option.

Lots of tests are copied from rome toools and esbuild. If you want to use tests, please consult license of those libraries.
