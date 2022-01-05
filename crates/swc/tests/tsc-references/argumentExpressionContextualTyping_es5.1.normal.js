function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
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
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o2, minLen) {
    if (!o2) return;
    if (typeof o2 === "string") return _arrayLikeToArray(o2, minLen);
    var n = Object.prototype.toString.call(o2).slice(8, -1);
    if (n === "Object" && o2.constructor) n = o2.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o2, minLen);
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
function baz(x) {}
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
