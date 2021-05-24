# Minifier

EcmaScript minifier for the swc project. This is basically a port of terser.

## Copying tests

Replace the content of `terser/test/compress.js` with it of `scripts/compress.js` and run `npm run test:compress`

# Note

Currently name mangler is very simple. To focus on creating a MVP, I (kdy1) will use simple logic for name mangler and implement the content-aware name mangler after publishing first non-beta version.
