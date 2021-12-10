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
function f0(a, b) {
    f0(a, b), f1(a, b), f2(a, b);
}
function f1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, _toConsumableArray(args)), f1("abc", "def"), f1.apply(void 0, [
        "abc"
    ].concat(_toConsumableArray(args))), f1.apply(void 0, _toConsumableArray(args));
}
function f2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    f0.apply(void 0, _toConsumableArray(args)), f1("abc", "def"), f1.apply(void 0, [
        "abc"
    ].concat(_toConsumableArray(args))), f1.apply(void 0, _toConsumableArray(args)), f2("abc", "def"), f2.apply(void 0, [
        "abc"
    ].concat(_toConsumableArray(args))), f2.apply(void 0, _toConsumableArray(args));
}
