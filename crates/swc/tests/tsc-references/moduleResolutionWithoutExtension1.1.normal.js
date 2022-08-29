//// [moduleResolutionWithoutExtension1.ts]
//// [/src/foo.mts]
export function foo() {
    return "";
}
//// [/src/bar.mts]
// Extensionless relative path ES import in an ES module
export { }; // should error, ask for extension, no extension suggestion
