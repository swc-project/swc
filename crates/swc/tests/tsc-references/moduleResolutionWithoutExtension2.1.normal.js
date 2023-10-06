//// [moduleResolutionWithoutExtension2.ts]
//// [/src/buzz.mts]
// Extensionless relative path cjs import in an ES module
export { }; // should error, should not ask for extension
