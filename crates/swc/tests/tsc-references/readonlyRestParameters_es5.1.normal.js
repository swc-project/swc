function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// @strict: true
// @declaration: true
function f0(a, b) {
    f0(a, b);
    f1(a, b);
    f2(a, b);
}
function f1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    f0.apply(void 0, _toConsumableArray(args)); // Error
    f1('abc', 'def');
    f1.apply(void 0, [
        'abc'
    ].concat(_toConsumableArray(args)));
    f1.apply(void 0, _toConsumableArray(args));
}
function f2() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    f0.apply(void 0, _toConsumableArray(args));
    f1('abc', 'def');
    f1.apply(void 0, [
        'abc'
    ].concat(_toConsumableArray(args)));
    f1.apply(void 0, _toConsumableArray(args));
    f2('abc', 'def');
    f2.apply(void 0, [
        'abc'
    ].concat(_toConsumableArray(args))); // Error
    f2.apply(void 0, _toConsumableArray(args));
}
function f4() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    args[0] = 'abc'; // Error
}
