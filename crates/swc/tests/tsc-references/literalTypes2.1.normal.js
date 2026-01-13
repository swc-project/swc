//// [literalTypes2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
    return E;
}(E || {});
var cond;
function f1() {
    var p1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, p2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "abc", p3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, p4 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    var v1 = 1;
    var v2 = -123;
    var v3 = 3 + 4;
    var v4 = "abc";
    var v5 = "";
    var v6 = "abc" + "def";
    var v7 = true;
    var v8 = 0;
    var x1 = 1;
    var x2 = -123;
    var x3 = 3 + 4;
    var x4 = "abc";
    var x5 = "";
    var x6 = "abc" + "def";
    var x7 = true;
    var x8 = 0;
    var c1 = 1;
    var c2 = -123;
    var c3 = 3 + 4;
    var c4 = "abc";
    var c5 = "";
    var c6 = "abc" + "def";
    var c7 = true;
    var c8 = 0;
}
function f2() {
    var p1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, p2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "abc", p3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, p4 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    var v1 = 1;
    var v2 = -123;
    var v3 = "abc";
    var v4 = true;
    var v5 = 0;
    var x1 = 1;
    var x2 = -123;
    var x3 = "abc";
    var x4 = true;
    var x5 = 0;
}
function f3() {
    var c1 = cond ? 1 : 2;
    var c2 = cond ? 1 : "two";
    var c3 = cond ? 0 : cond ? true : 123;
    var c4 = cond ? "abc" : null;
    var c5 = cond ? 456 : undefined;
    var c6 = {
        kind: 123
    };
    var c7 = [
        1,
        "bar"
    ];
    var c8 = cond ? c6 : cond ? c7 : "hello";
    var x1 = c1;
    var x2 = c2;
    var x3 = c3;
    var x4 = c4;
    var x5 = c5;
    var x6 = c6;
    var x7 = c7;
    var x8 = c8;
}
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
    this.x1 = 1;
    this.x2 = -123;
    this.x3 = 3 + 4;
    this.x4 = "abc";
    this.x5 = "";
    this.x6 = "abc" + "def";
    this.x7 = true;
    this.x8 = 0;
    this.c1 = 1;
    this.c2 = -123;
    this.c3 = 3 + 4;
    this.c4 = "abc";
    this.c5 = "";
    this.c6 = "abc" + "def";
    this.c7 = true;
    this.c8 = 0;
};
function f4() {
    var c1 = {
        a: 1,
        b: "foo"
    };
    var c2 = {
        a: 1,
        b: "foo"
    };
    var x1 = {
        a: 1,
        b: "foo"
    };
    var x2 = {
        a: 1,
        b: "foo"
    };
}
function f5() {
    var c1 = [
        1,
        "foo"
    ];
    var c2 = [
        1,
        "foo"
    ];
    var c3 = [
        1,
        "foo"
    ];
    var x1 = [
        1,
        "foo"
    ];
    var x2 = [
        1,
        "foo"
    ];
    var x3 = [
        1,
        "foo"
    ];
}
function f6() {
    var _ref = {
        c1: false,
        c2: 1,
        c3: "bar"
    }, _ref_c1 = _ref.c1, c1 = _ref_c1 === void 0 ? true : _ref_c1, _ref_c2 = _ref.c2, c2 = _ref_c2 === void 0 ? 0 : _ref_c2, _ref_c3 = _ref.c3, c3 = _ref_c3 === void 0 ? "foo" : _ref_c3;
    var _ref1 = {
        x1: false,
        x2: 1,
        x3: "bar"
    }, _ref_x1 = _ref1.x1, x1 = _ref_x1 === void 0 ? true : _ref_x1, _ref_x2 = _ref1.x2, x2 = _ref_x2 === void 0 ? 0 : _ref_x2, _ref_x3 = _ref1.x3, x3 = _ref_x3 === void 0 ? "foo" : _ref_x3;
}
function f10() {
    return "hello";
}
function f11() {
    return cond ? 1 : "two";
}
function f12() {
    if (cond) {
        return 1;
    } else {
        return "two";
    }
}
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.foo = function foo() {
        return 0;
    };
    _proto.bar = function bar() {
        return cond ? 0 : 1;
    };
    return C2;
}();
function f20() {
    var f1 = function() {
        return 0;
    };
    var f2 = function() {
        return "hello";
    };
    var f3 = function() {
        return true;
    };
    var f4 = function() {
        return 2;
    };
    var f5 = function() {
        return "foo";
    };
    var f6 = function() {
        return "bar";
    };
    var f7 = function() {
        return "bar";
    };
}
var a = [
    1,
    2
];
var x1 = g1(1); // Type 1
var x2 = g2(1, 1); // Type 1
var x3 = g2(1, 2); // Type 1 | 2
var x4 = g3(1, "two"); // Type 1 | "two"
var x5 = g4(1); // Type number[]
var x6 = g5(1, 2); // Type (1 | 2)[]
var x7 = g6([
    1,
    2
]); // Type number
var x8 = g6(a); // Type 1 | 2
var x9 = g7(a); // Type (1 | 2)[]
var x10 = g8(1, function(x) {
    return x;
}); // Type number
var x11 = g8(1, function(x) {
    return x + 1;
}); // Type number
function makeArray(x) {
    return [
        x
    ];
}
function append(a, x) {
    var result = a.slice();
    result.push(x);
    return result;
}
var aa = makeArray(0);
aa = append(aa, 1);
