//// [0.ts]
export function foo() {
    return "foo";
}
//// [1.ts]
import("./0"), import("./0").then((zero)=>zero.foo());
export var p2 = import("./0");
