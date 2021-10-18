function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// @downlevelIteration: true
/* AssignmentPattern:
 *      ObjectAssignmentPattern
 *      ArrayAssignmentPattern
 * ArrayAssignmentPattern:
 *      [Elision<opt>   AssignmentRestElementopt   ]
 *      [AssignmentElementList]
 *      [AssignmentElementList, Elision<opt>   AssignmentRestElementopt   ]
 * AssignmentElementList:
 *      Elision<opt>   AssignmentElement
 *      AssignmentElementList, Elisionopt   AssignmentElement
 * AssignmentElement:
 *      LeftHandSideExpression   Initialiseropt
 *      AssignmentPattern   Initialiseropt
 * AssignmentRestElement:
 *      ...   LeftHandSideExpression
 */ // In a destructuring assignment expression, the type of the expression on the right must be assignable to the assignment target on the left.
// An expression of type S is considered assignable to an assignment target V if one of the following is true
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is the type Any, or
var _undefined = _slicedToArray(undefined, 2), a0 = _undefined[0], a1 = _undefined[1];
var _undefined1 = _slicedToArray(undefined, 2), tmp = _undefined1[0], a2 = tmp === void 0 ? false : tmp, tmp1 = _undefined1[1], a3 = tmp1 === void 0 ? 1 : tmp1;
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is a tuple- like type (section 3.3.3) with a property named N of a type that is assignable to the target given in E,
//        where N is the numeric index of E in the array assignment pattern, or
var b0 = 2, b1 = 3, b2 = 4;
var b3 = 1, b4 = 2, b5 = "string";
function foo() {
    return [
        1,
        2,
        3
    ];
}
var ref = _slicedToArray(foo(), 2), b6 = ref[0], b7 = ref[1];
var ref1 = _toArray(foo()), b8 = ref1.slice(0);
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
];
var ref2 = _slicedToArray(_toConsumableArray(temp), 2), c0 = ref2[0], c1 = ref2[1];
var ref3 = [], c2 = ref3[0];
var ref4 = [], c3 = ref4[0], ref5 = [], c4 = ref5[0];
var c5 = 1, c6 = true;
var ref6 = [
    1,
    2,
    3
], c7 = ref6[1];
var c8 = 1;
var c9 = 1;
var c10 = [
    1,
    2,
    3,
    4,
    "hello"
];
var c11 = 1, c12 = 2, c13 = [
    "string"
];
var c14 = 1, c15 = 2, c16 = "string";
