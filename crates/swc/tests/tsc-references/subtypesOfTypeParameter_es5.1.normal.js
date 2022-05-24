import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// checking whether other types are subtypes of type parameters
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var D1 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(D1, C3);
    var _super = _create_super(D1);
    function D1() {
        _class_call_check(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(C3);
function f1(x, y) {
    var r = true ? x : y; // error
    var r = true ? y : x; // error
}
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
function f() {}
(function(f3) {
    var bar = f3.bar = 1;
})(f || (f = {}));
var c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
// errors throughout
function f2(x1, y) {
    var f17 = function f17(a) {
        var r17 = true ? x1 : a;
        var r17 = true ? a : x1;
    };
    var f18 = function f18(a) {
        var r18 = true ? x1 : a;
        var r18 = true ? a : x1;
    };
    var r0 = true ? x1 : null;
    var r0 = true ? null : x1;
    var u;
    var r0b = true ? u : x1;
    var r0b = true ? x1 : u;
    var r1 = true ? 1 : x1;
    var r1 = true ? x1 : 1;
    var r2 = true ? "" : x1;
    var r2 = true ? x1 : "";
    var r3 = true ? true : x1;
    var r3 = true ? x1 : true;
    var r4 = true ? new Date() : x1;
    var r4 = true ? x1 : new Date();
    var r5 = true ? /1/ : x1;
    var r5 = true ? x1 : /1/;
    var r6 = true ? {
        foo: 1
    } : x1;
    var r6 = true ? x1 : {
        foo: 1
    };
    var r7 = true ? function() {} : x1;
    var r7 = true ? x1 : function() {};
    var r8 = true ? function(x) {
        return x;
    } : x1;
    var r8b = true ? x1 : function(x) {
        return x;
    }; // type parameters not identical across declarations
    var i1;
    var r9 = true ? i1 : x1;
    var r9 = true ? x1 : i1;
    var c1;
    var r10 = true ? c1 : x1;
    var r10 = true ? x1 : c1;
    var c2;
    var r12 = true ? c2 : x1;
    var r12 = true ? x1 : c2;
    var r13 = true ? E : x1;
    var r13 = true ? x1 : E;
    var r14 = true ? E.A : x1;
    var r14 = true ? x1 : E.A;
    var af;
    var r15 = true ? af : x1;
    var r15 = true ? x1 : af;
    var ac;
    var r16 = true ? ac : x1;
    var r16 = true ? x1 : ac;
    var r19 = true ? new Object() : x1; // BCT is Object
    var r19 = true ? x1 : new Object(); // BCT is Object
    var r20 = true ? {} : x1; // ok
    var r20 = true ? x1 : {}; // ok
}
