//// [0.ts]
export function foo() {
    return "foo";
}
//// [1.ts]
import("./0");
var p1 = import("./0");
function foo() {
    import("./0");
}
p1.then((zero)=>zero.foo());
