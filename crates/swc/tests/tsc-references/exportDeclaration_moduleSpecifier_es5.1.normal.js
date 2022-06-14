import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: /a.ts
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
new A();
