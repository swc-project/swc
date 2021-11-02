function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
// A parameter declaration may specify either an identifier or a binding pattern.
// The identifiers specified in parameter declarations and binding patterns
// in a parameter list must be unique within that parameter list.
// If the declaration includes a type annotation, the parameter is of that type
function a1(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref1 = _slicedToArray(ref[0], 1), c = ref1[0];
}
function a2(o) {
}
function a3(param) {
    var j = param.j, k = param.k, _l = param.l, m = _l.m, n = _l.n, _q = _slicedToArray(param.q, 3), a = _q[0], b = _q[1], c = _q[2];
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
function b1(param) {
    var z = param === void 0 ? [
        undefined,
        null
    ] : param;
}
function b2(param, param1) {
    var z = param === void 0 ? null : param, o = param1 === void 0 ? {
        x: 0,
        y: undefined
    } : param1;
}
function b3(param) {
    var ref = param === void 0 ? {
        z: {
            x: "hi",
            y: {
                j: 1
            }
        }
    } : param, _z = ref.z, x = _z.x, j = _z.y.j;
}
function b6(param) {
    var ref = _slicedToArray(param === void 0 ? [
        undefined,
        null,
        undefined
    ] : param, 3), a = ref[0], z = ref[1], y = ref[2];
}
function b7(param) {
    var ref = _slicedToArray(param === void 0 ? [
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
    ] : param, 3), ref2 = _slicedToArray(ref[0], 1), a = ref2[0], b = ref[1], ref3 = _slicedToArray(ref[2], 1), ref4 = _slicedToArray(ref3[0], 2), c = ref4[0], d = ref4[1];
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
b6([
    "string",
    1,
    2
]); // Shouldn't be an error
b7([
    [
        "string"
    ],
    1,
    [
        [
            true,
            false
        ]
    ]
]); // Shouldn't be an error
var // If the declaration specifies a binding pattern, the parameter type is the implied type of that binding pattern (section 5.1.3)
Foo1;
(function(Foo) {
    Foo[Foo["a"] = 0] = "a";
})(Foo1 || (Foo1 = {
}));
function c0(param) {
    var _z = param.z, x = _z.x, j = _z.y.j;
}
function c1(param) {
    var z = (param === void 0 ? {
        z: 10
    } : param).z;
}
function c2(param) {
    var _z = param.z, z = _z === void 0 ? 10 : _z;
}
function c3(param) {
    var b = (param === void 0 ? {
        b: "hello"
    } : param).b;
}
function c5(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref5 = _slicedToArray(ref[0], 1), c = ref5[0];
}
function c6(param) {
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref6 = _slicedToArray(ref[0], 1), tmp = ref6[0], c = tmp === void 0 ? 1 : tmp;
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
c2({
}); // Implied type is {z?: number}
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
// A parameter can be marked optional by following its name or binding pattern with a question mark (?)
// or by including an initializer.
function d0(x) {
}
function d0(param) {
    var x = param === void 0 ? 10 : param;
}
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
        {
            key: "d3",
            value: function d3() {
            }
        },
        {
            key: "d4",
            value: function d4() {
            }
        },
        {
            key: "e0",
            value: function e0(param) {
                var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], c = _param[2];
            }
        }
    ]);
    return C2;
}();
var C3 = /*#__PURE__*/ function() {
    "use strict";
    function C3() {
        _classCallCheck(this, C3);
    }
    _createClass(C3, [
        {
            key: "d3",
            value: function d3(param) {
                var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], c = _param[2];
            }
        },
        {
            key: "d4",
            value: function d4(param) {
                var x = param.x, y = param.y, z = param.z;
            }
        },
        {
            key: "e0",
            value: function e0(param) {
                var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], c = _param[2];
            }
        }
    ]);
    return C3;
}();
function d5(param) {
    var ref = param === void 0 ? {
        x: 1,
        y: 2
    } : param, x = ref.x, y = ref.y;
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
    var _x = _slicedToArray(param.x, 3), number = _x[0], string = _x[1], any = _x[2];
} // x has type [any, any, any]
function e5(param) {
    var _x = _slicedToArray(param.x, 3), a = _x[0], b = _x[1], c = _x[2];
} // x has type [any, any, any]
