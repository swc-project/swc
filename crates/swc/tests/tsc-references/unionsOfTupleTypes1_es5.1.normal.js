function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function f1(t1, t2, t3, t4, x1) {
    var _t1 = _slicedToArray(t1, 3), d10 = _t1[0], d11 = _t1[1], d12 = _t1[2]; // string, number
    var _t2 = _slicedToArray(t2, 3), d20 = _t2[0], d21 = _t2[1], d22 = _t2[2]; // string | boolean, number | undefined
    var _t3 = _slicedToArray(t3, 3), d30 = _t3[0], d31 = _t3[1], d32 = _t3[2]; // string, number, number
    var _t4 = _slicedToArray(t4, 3), d40 = _t4[0], d41 = _t4[1], d42 = _t4[2]; // string | boolean, number | undefined, number | undefined
    var ref;
    ref = _slicedToArray(t1, 3), d10 = ref[0], d11 = ref[1], d12 = ref[2], ref;
    var ref1;
    ref1 = _slicedToArray(t2, 3), d20 = ref1[0], d21 = ref1[1], d22 = ref1[2], ref1;
    var ref2;
    ref2 = _slicedToArray(t3, 3), d30 = ref2[0], d31 = ref2[1], d32 = ref2[2], ref2;
    var ref3;
    ref3 = _slicedToArray(t4, 3), d40 = ref3[0], d41 = ref3[1], d42 = ref3[2], ref3;
    var t10 = t1[0]; // string
    var t11 = t1[1]; // number
    var t12 = t1[2]; // undefined
    var t1x = t1[x1]; // string | number
    var t20 = t2[0]; // string | boolean
    var t21 = t2[1]; // number | undefined
    var t22 = t2[2]; // undefined
    var t2x = t2[x1]; // string | number | boolean
    var t30 = t3[0]; // string
    var t31 = t3[1]; // number
    var t32 = t3[2]; // number
    var t3x = t3[x1]; // string | number
    var t40 = t4[0]; // string | boolean
    var t41 = t4[1]; // number | undefined
    var t42 = t4[2]; // number | undefined
    var t4x = t4[x1]; // string | number | boolean
    t1[1] = 42;
    t2[1] = 42;
    t3[1] = 42;
    t4[1] = 42;
}
var ex = [
    "hi"
];
var _ex = _slicedToArray(ex, 2), x = _ex[0], y = _ex[1];
