//// [moduleResolutionWithoutExtension3.ts]
//// [/src/foo.tsx]
export function foo() {
    return "";
}
//// [/src/bar.mts]
// Extensionless relative path ES import in an ES module
export { }; // should error, suggest adding ".jsx"
