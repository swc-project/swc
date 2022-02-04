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
all.apply(void 0, _toConsumableArray(ns)), weird.apply(void 0, _toConsumableArray(ns)), weird.apply(void 0, _toConsumableArray(mixed)), weird.apply(void 0, _toConsumableArray(tuple)), prefix.apply(void 0, [
    "a"
].concat(_toConsumableArray(ns))), rest.apply(void 0, [
    "d"
].concat(_toConsumableArray(ns))), normal.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns))), thunk.apply(void 0, _toConsumableArray(ns)), all.apply(void 0, _toConsumableArray(mixed)), all.apply(void 0, _toConsumableArray(tuple)), prefix.apply(void 0, [
    "b"
].concat(_toConsumableArray(mixed))), prefix.apply(void 0, [
    "c"
].concat(_toConsumableArray(tuple))), rest.apply(void 0, [
    "e"
].concat(_toConsumableArray(mixed))), rest.apply(void 0, [
    "f"
].concat(_toConsumableArray(tuple))), prefix.apply(void 0, _toConsumableArray(ns)), prefix.apply(void 0, _toConsumableArray(mixed)), prefix.apply(void 0, _toConsumableArray(tuple)), prefix2.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns)));
