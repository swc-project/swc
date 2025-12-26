//// [classStaticBlock2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __2 = new WeakMap();
var a = 1;
var b = 2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
__.set(C, {
    writable: true,
    value: function() {
        var a = 11;
        a;
        b;
    }()
});
__2.set(C, {
    writable: true,
    value: function() {
        var a = 11;
        a;
        b;
    }()
});
