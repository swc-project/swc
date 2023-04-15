//// [instanceMemberWithComputedPropertyName.ts]
// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x = 1;
var C = function C() {
    _class_call_check(this, C);
    this[x] = true;
    var _ref = {
        a: 1,
        b: 2
    }, a = _ref.a, b = _ref.b;
};
