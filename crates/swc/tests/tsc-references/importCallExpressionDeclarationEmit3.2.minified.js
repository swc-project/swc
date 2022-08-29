//// [importCallExpressionDeclarationEmit3.ts]
//// [0.ts]
export function foo() {
    return "foo";
}
//// [1.ts]
import("./0");
export var p0 = import(getPath());
export var p1 = import("./0");
export var p2 = import("./0");
