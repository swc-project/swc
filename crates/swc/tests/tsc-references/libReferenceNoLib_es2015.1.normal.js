// @target: esnext
// @module: commonjs
// @noLib: true
// @declaration: true
// Test that passing noLib disables <reference lib> resolution.
// @filename: fakelib.ts
export const elem = {
    field: 'a'
};
