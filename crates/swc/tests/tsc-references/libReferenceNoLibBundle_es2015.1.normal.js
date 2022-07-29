// @target: esnext
// @module: amd
// @noLib: true
// @declaration: true
// @outFile: bundle.js
// Test that passing noLib disables <reference lib> resolution.
// @filename: fakelib.ts
// @filename: file1.ts
/// <reference lib="dom" />
export const elem = {
    field: 'a'
};
