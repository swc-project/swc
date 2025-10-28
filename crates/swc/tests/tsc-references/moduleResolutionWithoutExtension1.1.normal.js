//// [moduleResolutionWithoutExtension1.ts]
//// [/src/foo.mts]
export function foo() {
    return "";
}
//// [/src/bar.mts]
export { }; // should error, ask for extension, no extension suggestion
