//// [classStaticBlock28.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var foo;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var __ = {
    writable: true,
    value: function() {
        foo = 1;
    }()
};
console.log(foo);
