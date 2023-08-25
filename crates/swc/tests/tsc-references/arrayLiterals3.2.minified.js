//// [arrayLiterals3.ts]
// Each element expression in a non-empty array literal is processed as follows:
//    - If the array literal contains no spread elements, and if the array literal is contextually typed (section 4.19)
//      by a type T and T has a property with the numeric name N, where N is the index of the element expression in the array literal,
//      the element expression is contextually typed by the type of that property.
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is contextually typed by a tuple-like type,
//       the resulting type is a tuple type constructed from the types of the element expressions.
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is an array assignment pattern in a destructuring assignment (section 4.17.1),
//       the resulting type is a tuple type constructed from the types of the element expressions.
var _ref = [
    1,
    2,
    "string",
    !0
];
_ref[0], _ref[1];
var temp1 = [
    1,
    2,
    3
];
_to_consumable_array([
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
]), _to_consumable_array(temp1), _to_consumable_array(temp1).concat(_to_consumable_array([
    "s",
    "t",
    "r"
]));
 // Error cannot assign (number|string)[] to number[]
