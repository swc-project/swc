export function foo() {
    return "foo";
}
import("./0"), import("./0").then(function(zero) {
    return zero.foo();
});
export var p2 = import("./0");
