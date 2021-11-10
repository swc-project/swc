# Minifier

EcmaScript minifier for the swc project. This is basically a port of terser.

# Note

Currently name mangler is very simple. To focus on creating a MVP, I (kdy1) will use simple logic for name mangler and implement the content-aware name mangler after publishing first non-beta version.

## Testing

### Real-library tests

You can use vscode to see diffs. Select a file from `tests/projects/output` and select the corresponding file from `tests/projects/refs`. Then you can right click to see an option to open diff.

#### Splitting a library test

Extracting only subset from a library test makes development much easier.

Split status:

-   [ ] angular-1.2.5
-   [x] backbone-1.1.0
-   [ ] jquery-1.9.1
-   [ ] jquery.mobile-1.4.2
-   [ ] mootools-1.4.5
-   [x] underscore-1.5.2
-   [ ] yui-3.12.0

### Tests from terser

Tests ported from terser has

-   input.js
-   config.json
-   mangle.json (if name mangling is enabled)
-   output.js (if exists and can be modified if our one is better or due to lack of frequency-aware base54)
-   output.terser.js (if exists)

#### Copying tests

Replace the content of `terser/test/compress.js` with it of `scripts/compress.js` and run `npm run test:compress`
