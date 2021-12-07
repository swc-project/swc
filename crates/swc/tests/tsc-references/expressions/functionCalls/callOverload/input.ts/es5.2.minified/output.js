var n;
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
        var n1 = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n1 && o.constructor && (n1 = o.constructor.name), "Map" === n1 || "Set" === n1) return Array.from(n1);
        if ("Arguments" === n1 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n1)) return _arrayLikeToArray(o, minLen);
    }
}
fn(1), fn(1, 2, 3, 4), takeTwo(1, 2, 3, 4), withRest.apply(void 0, [
    "a"
].concat(_toConsumableArray(n))), withRest(), withRest.apply(void 0, _toConsumableArray(n));
