export function foo() {
    return "foo";
}
import("./0"), import("./0").then(function(zero) {
    return zero.foo();
});
