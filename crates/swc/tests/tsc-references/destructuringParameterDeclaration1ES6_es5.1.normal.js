import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
// Conformance for emitting ES6
// @target: es6
// A parameter declaration may specify either an identifier or a binding pattern.
// The identifiers specified in parameter declarations and binding patterns
// in a parameter list must be unique within that parameter list.
// If the declaration includes a type annotation, the parameter is of that type
function a1(param) {
    var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], ref = _sliced_to_array(_param[2], 1), ref1 = _sliced_to_array(ref[0], 1), c = ref1[0];
}
function a2(o) {}
function a3(param) {
    var j = param.j, k = param.k, _l = param.l, m = _l.m, n = _l.n, _q = _sliced_to_array(param.q, 3), a = _q[0], b = _q[1], c = _q[2];
}
function a4(param) {
    var x = param.x, a = param.a;
}
a1([
    1,
    2,
    [
        [
            "world"
        ]
    ]
]);
a1([
    1,
    2,
    [
        [
            "world"
        ]
    ],
    3
]);
// If the declaration includes an initializer expression (which is permitted only
// when the parameter list occurs in conjunction with a function body),
// the parameter type is the widened form (section 3.11) of the type of the initializer expression.
function b1() {
    var z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        undefined,
        null
    ];
}
function b2() {
    var z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        x: 0,
        y: undefined
    };
}
function b3() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        z: {
            x: "hi",
            y: {
                j: 1
            }
        }
    }, _z = ref.z, x = _z.x, j = _z.y.j;
}
function b6() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        undefined,
        null,
        undefined
    ], 3), a = ref[0], z = ref[1], y = ref[2];
}
function b7() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        [
            undefined
        ],
        undefined,
        [
            [
                undefined,
                undefined
            ]
        ]
    ], 3), ref2 = _sliced_to_array(ref[0], 1), a = ref2[0], b = ref[1], ref3 = _sliced_to_array(ref[2], 1), ref4 = _sliced_to_array(ref3[0], 2), c = ref4[0], d = ref4[1];
}
b1([
    1,
    2,
    3
]); // z is widen to the type any[]
b2("string", {
    x: 200,
    y: "string"
});
b2("string", {
    x: 200,
    y: true
});
var // If the declaration specifies a binding pattern, the parameter type is the implied type of that binding pattern (section 5.1.3)
Foo;
(function(Foo) {
    Foo[Foo["a"] = 0] = "a";
})(Foo || (Foo = {}));
function c0(param) {
    var _z = param.z, x = _z.x, j = _z.y.j;
}
function c1() {
    var z = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        z: 10
    }).z;
}
function c2(param) {
    var _z = param.z, z = _z === void 0 ? 10 : _z;
}
function c3() {
    var b = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        b: "hello"
    }).b;
}
function c5(param) {
    var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], ref = _sliced_to_array(_param[2], 1), ref5 = _sliced_to_array(ref[0], 1), c = ref5[0];
}
function c6(param) {
    var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], ref = _sliced_to_array(_param[2], 1), ref6 = _sliced_to_array(ref[0], 1), tmp = ref6[0], c = tmp === void 0 ? 1 : tmp;
}
c0({
    z: {
        x: 1,
        y: {
            j: "world"
        }
    }
}); // Implied type is { z: {x: any, y: {j: any}} }
c0({
    z: {
        x: "string",
        y: {
            j: true
        }
    }
}); // Implied type is { z: {x: any, y: {j: any}} }
c1(); // Implied type is {z:number}?
c1({
    z: 1
}) // Implied type is {z:number}? 
;
c2({}); // Implied type is {z?: number}
c2({
    z: 1
}); // Implied type is {z?: number}
c3({
    b: 1
}); // Implied type is { b: number|string }.
c5([
    1,
    2,
    [
        [
            "string"
        ]
    ]
]); // Implied type is is [any, any, [[any]]]
c5([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    false,
    true
]); // Implied type is is [any, any, [[any]]]
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.d3 = function d3() {};
    _proto.d4 = function d4() {};
    _proto.e0 = function e0(param) {
        var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], c = _param[2];
    };
    return C2;
}();
var C3 = /*#__PURE__*/ function() {
    "use strict";
    function C3() {
        _class_call_check(this, C3);
    }
    var _proto = C3.prototype;
    _proto.d3 = function d3(param) {
        var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], c = _param[2];
    };
    _proto.d4 = function d4(param) {
        var x = param.x, y = param.y, z = param.z;
    };
    _proto.e0 = function e0(param) {
        var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], c = _param[2];
    };
    return C3;
}();
function d5() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: 1,
        y: 2
    }, x = ref.x, y = ref.y;
}
d5(); // Parameter is optional as its declaration included an initializer
// Destructuring parameter declarations do not permit type annotations on the individual binding patterns,
// as such annotations would conflict with the already established meaning of colons in object literals.
// Type annotations must instead be written on the top- level parameter declaration
function e1(param) {
    var number = param.x;
} // x has type any NOT number
function e2(param) {
    var x = param.x;
} // x is type number
function e3(param) {
    var x = param.x;
} // x is an optional with type number
function e4(param) {
    var _x = _sliced_to_array(param.x, 3), number = _x[0], string = _x[1], any = _x[2];
} // x has type [any, any, any]
function e5(param) {
    var _x = _sliced_to_array(param.x, 3), a = _x[0], b = _x[1], c = _x[2];
} // x has type [any, any, any]
function e6(param) {
    var _x = _sliced_to_array(param.x, 3), number = _x[0], number = _x[1], number = _x[2];
} // error, duplicate identifier;
