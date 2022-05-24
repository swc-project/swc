import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
export { Foo as default };
// @filename: b.ts
export default function foo() {};
