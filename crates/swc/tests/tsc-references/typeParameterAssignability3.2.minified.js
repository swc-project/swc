//// [typeParameterAssignability3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
function foo(t, u) {}
var C = function C() {
    "use strict";
    var _this = this;
    _class_call_check(this, C), this.r = function() {
        _this.t = _this.u, _this.u = _this.t;
    };
};
