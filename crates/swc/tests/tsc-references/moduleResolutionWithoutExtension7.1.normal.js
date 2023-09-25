//// [moduleResolutionWithoutExtension7.ts]
//// [/src/bar.cts]
// Extensionless relative path cjs import in a cjs module
export { }; // should error, should not ask for extension
