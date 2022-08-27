//// [moduleResolutionWithoutExtension8.ts]
//// [/src/bar.cts]
// Extensionless relative path dynamic import in a cjs module
import("./foo").then(function(x) {
    return x;
}); // should error, ask for extension
