//// [parserAccessibilityAfterStatic3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var Outer = function Outer() {
    "use strict";
    _class_call_check(this, Outer);
};
__.set(Outer, {
    writable: true,
    value: Outer.public = 1
});
