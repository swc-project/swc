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
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is the type Any, or
var ref // Error
 = [], ref1 = _slicedToArray(ref[0], 1), a0 = ref1[0], ref2 = _slicedToArray(ref[1], 1), ref3 = _slicedToArray(ref2[0], 1), a1 = ref3[0];
var _undefined // Error
 = _slicedToArray(undefined, 2), ref4 = _slicedToArray(_undefined[0], 1), a2 = ref4[0], ref5 = _slicedToArray(_undefined[1], 1), ref6 = _slicedToArray(ref5[0], 1), a3 = ref6[0];
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
var ref7 = _slicedToArray(bar(), 3), tmp = ref7[0], b3 = tmp === void 0 ? "string" : tmp, b4 = ref7[1], b5 = ref7[2]; // Error
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
];
var ref8 = _slicedToArray(_toConsumableArray(temp), 2), c0 = ref8[0], c1 = ref8[1]; // Error
var ref9 = _slicedToArray(_toConsumableArray(temp), 2), c2 = ref9[0], c3 = ref9[1]; // Error
function foo(idx) {
    return {
        2: true
    };
}
var ref10 = _slicedToArray(foo(1), 3), c4 = ref10[0], c5 = ref10[1], c6 = ref10[2]; // Error
