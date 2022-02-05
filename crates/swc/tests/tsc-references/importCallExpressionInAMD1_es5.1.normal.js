// @module: amd
// @target: esnext
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
import("./0");
var p1 = import("./0");
p1.then(function(zero) {
    return zero.foo();
});
export var p2 = import("./0");
function foo() {
    var p2 = import("./0");
}
