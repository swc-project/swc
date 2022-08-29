//// [moduleResolutionWithoutExtension8.ts]
//// [/src/bar.cts]
import("./foo").then(function(x) {
    return x;
});
