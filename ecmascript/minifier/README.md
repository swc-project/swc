# Minifier

EcmaScript minifier for the swc project. This is basically a port of terser.

# Note

Currently name mangler is very simple. To focus on creating a MVP, I (kdy1) will use simple logic for name mangler and implement the content-aware name mangler after publishing first non-beta version.

## Testing

Tests ported from terser has

-   input.js
-   config.json
-   mangle.json (if name mangling is enabled)
-   output.js (if exists and can be modified if our one is better or due to lack of frequency-aware base54)
-   output.terser.js (if exists)

## Copying tests

Replace the content of `terser/test/compress.js` with it of `scripts/compress.js` and run `npm run test:compress`
