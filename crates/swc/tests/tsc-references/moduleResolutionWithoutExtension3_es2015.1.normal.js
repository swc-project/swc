// @moduleResolution: nodenext
// @module: nodenext
// @jsx: preserve
// @filename: /src/foo.tsx
export function foo() {
    return "";
}
// @filename: /src/bar.mts
// Extensionless relative path ES import in an ES module
export { }; // should error, suggest adding ".jsx"
