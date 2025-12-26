//// [classStaticBlock1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var a = 2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
__.set(C, {
    writable: true,
    value: function() {
        var a = 1;
        a;
    }()
});
