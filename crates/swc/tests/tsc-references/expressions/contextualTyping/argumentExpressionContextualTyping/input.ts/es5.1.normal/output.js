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
// In a typed function call, argument expressions are contextually typed by their corresponding parameter types.
function foo(param) {
    var _x = _slicedToArray(param.x, 2), a = _x[0], b = _x[1], _y = param.y, c = _y.c, d = _y.d, e = _y.e;
}
function bar(param) {
    var _x = _slicedToArray(param.x, 2), a = _x[0], tmp = _x[1], b = tmp === void 0 ? 10 : tmp, _y = param.y, c = _y.c, d = _y.d, _e = _y.e, e = _e === void 0 ? {
        f: 1
    } : _e;
}
function baz(x) {
}
var o = {
    x: [
        "string",
        1
    ],
    y: {
        c: true,
        d: "world",
        e: 3
    }
};
var o1 = {
    x: [
        "string",
        1
    ],
    y: {
        c: true,
        d: "world",
        e: 3
    }
};
foo(o1); // Not error since x has contextual type of tuple namely [string, number]
foo({
    x: [
        "string",
        1
    ],
    y: {
        c: true,
        d: "world",
        e: 3
    }
}); // Not error
var array = [
    "string",
    1,
    true
];
var tuple = [
    "string",
    1,
    true
];
baz(tuple);
baz([
    "string",
    1,
    true
]);
baz(array); // Error
baz([
    "string",
    1,
    true
].concat(_toConsumableArray(array))); // Error
foo(o); // Error because x has an array type namely (string|number)[]
