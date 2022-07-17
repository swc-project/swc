// @target: esnext
// @module: amd
// @noLib: true
// @declaration: true
// @outFile: bundle.js
// Test that passing noLib disables <reference lib> resolution.
// @filename: fakelib.ts
export var elem = {
    field: "a"
};
