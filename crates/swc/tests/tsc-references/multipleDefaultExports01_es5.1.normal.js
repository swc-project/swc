import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @filename: m2.ts
import Entity from "./m1";
var foo = function foo() {
    "use strict";
    _class_call_check(this, foo);
};
export { foo as default };
export default function bar() {};
var x = 10;
export default x;
Entity();
