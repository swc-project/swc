//// [typeOfThisInStaticMembers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    C.bar = function bar() {
        // type of this is the constructor function type
        var t = this;
        return this;
    };
    return C;
}();
var t = C.bar();
// all ok
var r2 = t.foo + 1;
var r3 = t.bar();
var r4 = new t(1);
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2(x) {
        _class_call_check(this, C2);
    }
    C2.bar = function bar() {
        // type of this is the constructor function type
        var t = this;
        return this;
    };
    return C2;
}();
var t2 = C2.bar();
// all ok
var r5 = t2.foo + 1;
var r6 = t2.bar();
var r7 = new t2('');
