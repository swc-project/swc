//// [classStaticBlockUseBeforeDef3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.doSomething = function() {
        console.log("gotcha!");
    }, A;
}(), __ = {
    writable: !0,
    value: void A.doSomething()
}, Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
}, __1 = {
    writable: !0,
    value: void console.log(FOO)
}, FOO = "FOO", Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
}, __2 = {
    writable: !0,
    value: void console.log(FOO)
}, u = "FOO", CFA = function() {
    "use strict";
    function CFA() {
        _class_call_check(this, CFA);
    }
    return CFA.doSomething = function() {}, CFA;
}(), __3 = {
    writable: !0,
    value: void 0
};
CFA.t = 1;
var __11 = {
    writable: !0,
    value: void 0
};
