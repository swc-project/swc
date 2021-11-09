function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// @target:es6
// ElementList:  ( Modified )
//      Elisionopt   AssignmentExpression
//      Elisionopt   SpreadElement
//      ElementList, Elisionopt   AssignmentExpression
//      ElementList, Elisionopt   SpreadElement
// SpreadElement:
//      ...   AssignmentExpression
var a0 = [
    ,
    ,
    2,
    3,
    4
];
var a1 = [
    "hello",
    "world"
];
var a2 = [
    ,
    ,
].concat(_toConsumableArray(a0), [
    "hello"
]);
var a3 = [
    ,
].concat(_toConsumableArray(a0));
var a4 = [
    function() {
        return 1;
    }, 
];
var a5 = _toConsumableArray(a0).concat([
    , 
]);
// Each element expression in a non-empty array literal is processed as follows:
//    - If the array literal contains no spread elements, and if the array literal is contextually typed (section 4.19)
//      by a type T and T has a property with the numeric name N, where N is the index of the element expression in the array literal,
//      the element expression is contextually typed by the type of that property.
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is contextually typed by a tuple-like type,
//       the resulting type is a tuple type constructed from the types of the element expressions.
var b0 = [
    undefined,
    null,
    undefined
];
var b1 = [
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
// The resulting type an array literal expression is determined as follows:
//     - If the array literal contains no spread elements and is an array assignment pattern in a destructuring assignment (section 4.17.1),
//       the resulting type is a tuple type constructed from the types of the element expressions.
var c0 = 1, c1 = 2; // tuple type [number, number]
var ref = [
    1,
    2,
    true
], c2 = ref[0], c3 = ref[1]; // tuple type [number, number, boolean]
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
var d0 = [
    1,
    true, 
].concat(_toConsumableArray(temp)); // has type (string|number|boolean)[]
var d1 = _toConsumableArray(temp); // has type string[]
var d2 = _toConsumableArray(temp1);
var d3 = _toConsumableArray(temp1);
var d4 = _toConsumableArray(temp).concat(_toConsumableArray(temp1));
var d5 = _toConsumableArray(a2);
var d6 = _toConsumableArray(a3);
var d7 = _toConsumableArray(a4);
var d8 = [
    _toConsumableArray(temp1)
];
var d9 = [
    _toConsumableArray(temp1)
].concat(_toConsumableArray([
    "hello"
]));
