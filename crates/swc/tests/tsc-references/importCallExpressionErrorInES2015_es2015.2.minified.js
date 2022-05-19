export function foo() {
    return "foo";
}
import("./0"), import("./0").then((zero)=>zero.foo());
