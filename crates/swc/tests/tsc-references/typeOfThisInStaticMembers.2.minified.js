//// [typeOfThisInStaticMembers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var t = /*#__PURE__*/ (function() {
    function C(x) {
        _class_call_check(this, C);
    }
    return C.bar = function() {
        return this;
    }, C;
})().bar();
t.foo, t.bar(), new t(1);
var t2 = /*#__PURE__*/ (function() {
    function C2(x) {
        _class_call_check(this, C2);
    }
    return C2.bar = function() {
        return this;
    }, C2;
})().bar();
t2.foo, t2.bar(), new t2('');
