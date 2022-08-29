//// [moduleResolutionWithoutExtension5.ts]
//// [/src/buzz.mts]
// Extensionless relative path dynamic import in an ES module
import("./foo").then(function(x) {
    return x;
}); // should error, ask for extension
