export function foo() {
    return "foo";
}
import("./0");
export var p0 = import(getPath());
export var p1 = import("./0");
export var p2 = import("./0");
