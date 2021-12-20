function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || _unsupportedIterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
fs2.apply(void 0, [
    "a"
].concat(_toConsumableArray(s2))), fs2.apply(void 0, [
    "a",
    "b",
    "c"
].concat(_toConsumableArray(s2))), fs2.apply(void 0, [
    "a",
    "b"
].concat(_toConsumableArray(s2), [
    "c"
])), fs2.apply(void 0, [
    "a",
    "b",
    "c"
].concat(_toConsumableArray(s2), [
    "d"
])), fs2.apply(void 0, _toConsumableArray(s2).concat([
    "a"
])), fs2.apply(void 0, _toConsumableArray(s3)), fs2_.apply(void 0, _toConsumableArray(s_)), fs2_.apply(void 0, _toConsumableArray(s2n_)), fs2_.apply(void 0, _toConsumableArray(s_).concat(_toConsumableArray(s_))), fs2_.apply(void 0, _toConsumableArray(s_).concat(_toConsumableArray(s_), _toConsumableArray(s_))), fs2n_.apply(void 0, _toConsumableArray(s2_)), fs2_.apply(void 0, _toConsumableArray(s2_)), fs2_.apply(void 0, _toConsumableArray(s2_).concat(_toConsumableArray(s_))), fs2_.apply(void 0, _toConsumableArray(s2_).concat(_toConsumableArray(s2_))), fs2_.apply(void 0, _toConsumableArray(s_).concat(_toConsumableArray(s2_))), fs2n_.apply(void 0, _toConsumableArray(s2n_)), fs2n_.apply(void 0, _toConsumableArray(s2)), fs5.apply(void 0, _toConsumableArray(s2).concat([
    "foo"
], _toConsumableArray(s2)));
