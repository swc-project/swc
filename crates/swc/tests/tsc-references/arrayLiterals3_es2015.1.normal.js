// Each element expression in a non-empty array literal is processed as follows:
//    - If the array literal contains no spread elements, and if the array literal is contextually typed (section 4.19)
//      by a type T and T has a property with the numeric name N, where N is the index of the element expression in the array literal,
//      the element expression is contextually typed by the type of that property.
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is contextually typed by a tuple-like type,
//       the resulting type is a tuple type constructed from the types of the element expressions.
var a0 = []; // Error
var a1 = [
    "string",
    1,
    true
]; // Error
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is an array assignment pattern in a destructuring assignment (section 4.17.1),
//       the resulting type is a tuple type constructed from the types of the element expressions.
var [b1, b2] = [
    1,
    2,
    "string",
    true
];
// The resulting type an array literal expression is determined as follows:
//      - the resulting type is an array type with an element type that is the union of the types of the
//        non - spread element expressions and the numeric index signature types of the spread element expressions
var temp = [
    "s",
    "t",
    "r"
];
var temp1 = [
    1,
    2,
    3
];
var temp2 = [
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
];
var c0 = [
    ...temp2
]; // Error
var c1 = [
    ...temp1
]; // Error cannot assign number[] to [number, number, number]
var c2 = [
    ...temp1,
    ...temp
]; // Error cannot assign (number|string)[] to number[]
