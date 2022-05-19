export function foo() {
    return "foo";
}
import("./0"), import("./0").then((zero)=>zero.foo());
export var p1, p2 = import("./0");
export class D {
    method() {
        import("./0");
    }
}
