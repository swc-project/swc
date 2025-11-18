//// [objectTypesIdentityWithPrivates2.ts]
// object types are identical structurally
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(C);
function foo1(x) {}
function foo2(x) {}
function foo3(x) {}
function foo4(x) {}
var r = foo4(new C());
var r = foo4(new D());
function foo5(x) {}
function foo6(x) {}
