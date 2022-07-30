// @module: es2020
// @target: es2020
// @declaration: true
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
import("./0");
export var p0 = import(getPath());
export var p1 = import("./0");
export var p2 = import("./0");
