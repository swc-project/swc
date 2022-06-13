import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
// @target: es6
// The type T associated with a destructuring variable declaration is determined as follows:
//      If the declaration includes a type annotation, T is that type.
var ref = {
    a1: 10,
    a2: "world"
}, a1 = ref.a1, a2 = ref.a2;
var a3 = 1, a4 = "hello", a5 = true;
// The type T associated with a destructuring variable declaration is determined as follows:
//      Otherwise, if the declaration includes an initializer expression, T is the type of that initializer expression.
var ref1 = {
    b1: {
        b11: "world"
    }
}, tmp = ref1.b1, b11 = (tmp === void 0 ? {
    b11: "string"
} : tmp).b11;
var temp = {
    t1: true,
    t2: "false"
};
var tmp1 = 3, b2 = tmp1 === void 0 ? 3 : tmp1, tmp2 = false, b3 = tmp2 === void 0 ? true : tmp2, tmp3 = {
    t1: false,
    t2: "hello"
}, b4 = tmp3 === void 0 ? temp : tmp3;
var ref2 = [
    undefined,
    undefined,
    undefined
], tmp4 = ref2[0], b5 = tmp4 === void 0 ? 3 : tmp4, tmp5 = ref2[1], b6 = tmp5 === void 0 ? true : tmp5, tmp6 = ref2[2], b7 = tmp6 === void 0 ? temp : tmp6;
// The type T associated with a binding element is determined as follows:
//      If the binding element is a rest element, T is an array type with
//          an element type E, where E is the type of the numeric index signature of S.
var c1 = [
    1,
    2,
    3
];
var c2 = [
    1,
    2,
    3,
    "string"
];
// The type T associated with a binding element is determined as follows:
//      Otherwise, if S is a tuple- like type (section 3.3.3):
//          	Let N be the zero-based index of the binding element in the array binding pattern.
// 	            If S has a property with the numerical name N, T is the type of that property.
var d1 = 1, d2 = "string";
// The type T associated with a binding element is determined as follows:
//      Otherwise, if S is a tuple- like type (section 3.3.3):
//              Otherwise, if S has a numeric index signature, T is the type of the numeric index signature.
var temp1 = [
    true,
    false,
    true
];
var ref3 = _sliced_to_array([
    1,
    "string"
].concat(_to_consumable_array(temp1)), 2), d3 = ref3[0], d4 = ref3[1];
//  Combining both forms of destructuring,
var ref4 = {
    e: [
        1,
        2,
        {
            b1: 4,
            b4: 0
        }
    ]
}, _e = _sliced_to_array(ref4.e, 3), e1 = _e[0], e2 = _e[1], tmp7 = _e[2], e3 = tmp7 === void 0 ? {
    b1: 1000,
    b4: 200
} : tmp7;
var ref5 = {
    f: [
        1,
        2,
        {
            f3: 4,
            f5: 0
        }
    ]
}, _f = _sliced_to_array(ref5.f, 3), f1 = _f[0], f2 = _f[1], ref6 = _f[2], f4 = ref6.f3, f5 = ref6.f5;
// When a destructuring variable declaration, binding property, or binding element specifies
// an initializer expression, the type of the initializer expression is required to be assignable
// to the widened form of the type associated with the destructuring variable declaration, binding property, or binding element.
var ref7 = {
    g: {
        g1: [
            1,
            2
        ]
    }
}, _g = ref7.g, _g1 = _g.g1, g1 = _g1 === void 0 ? [
    undefined,
    null
] : _g1;
var ref8 = {
    h: {
        h1: [
            1,
            2
        ]
    }
}, _h = ref8.h, _h1 = _h.h1, h1 = _h1 === void 0 ? [
    undefined,
    null
] : _h1;
