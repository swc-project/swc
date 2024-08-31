//// [typeGuardFunction.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(A);
var a;
var b;
// Basic
if (isC(a)) {
    a.propC;
}
// Sub type
var subType;
if (isA(subType)) {
    subType.propC;
}
// Union type
var union;
if (isA(union)) {
    union.propA;
}
if (isC_multipleParams(a, 0)) {
    a.propC;
}
// Methods
var obj;
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    _proto.method1 = function method1(p1) {
        return true;
    };
    return D;
}();
// Arrow function
var f1 = function(p1) {
    return false;
};
// Function expressions
f2(function(p1) {
    return true;
});
acceptingBoolean(isA(a));
acceptingTypeGuardFunction(isA);
// Binary expressions
var union2;
var union3 = isA(union2) || union2;
