// @target: esnext
// @module: commonjs
// @noLib: true
// @declaration: true
// Test that passing noLib disables <reference lib> resolution.
// @filename: fakelib.ts
// @filename: file1.ts
/// <reference lib="dom" />
export const elem = {
    field: 'a'
};
