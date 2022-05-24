import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is the type Any, or
var ref // Error
 = [], ref1 = _sliced_to_array(ref[0], 1), a0 = ref1[0], ref2 = _sliced_to_array(ref[1], 1), ref3 = _sliced_to_array(ref2[0], 1), a1 = ref3[0];
var _undefined // Error
 = _sliced_to_array(undefined, 2), ref4 = _sliced_to_array(_undefined[0], 1), a2 = ref4[0], ref5 = _sliced_to_array(_undefined[1], 1), ref6 = _sliced_to_array(ref5[0], 1), a3 = ref6[0];
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is a tuple- like type (section 3.3.3) with a property named N of a type that is assignable to the target given in E,
//        where N is the numeric index of E in the array assignment pattern, or
var b0 = 1, b1 = 2, b2 = "string"; // Error
function bar() {
    return [
        1,
        2,
        3
    ];
}
var ref7 = _sliced_to_array(bar(), 3), tmp = ref7[0], b3 = tmp === void 0 ? "string" : tmp, b4 = ref7[1], b5 = ref7[2]; // Error
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
];
var ref8 = _sliced_to_array(_to_consumable_array(temp), 2), c0 = ref8[0], c1 = ref8[1]; // Error
var ref9 = _sliced_to_array(_to_consumable_array(temp), 2), c2 = ref9[0], c3 = ref9[1]; // Error
function foo(idx) {
    return {
        2: true
    };
}
var ref10 = _sliced_to_array(foo(1), 3), c4 = ref10[0], c5 = ref10[1], c6 = ref10[2]; // Error
