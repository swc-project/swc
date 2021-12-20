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
function f0() {
    var a = [
        1,
        2,
        3
    ];
    var a1 = _toConsumableArray(a);
    var a2 = [
        1
    ].concat(_toConsumableArray(a));
    var a3 = [
        1,
        2
    ].concat(_toConsumableArray(a));
    var a4 = _toConsumableArray(a).concat([
        1
    ]);
    var a5 = _toConsumableArray(a).concat([
        1,
        2
    ]);
    var a6 = [
        1,
        2
    ].concat(_toConsumableArray(a), [
        1,
        2
    ]);
    var a7 = [
        1
    ].concat(_toConsumableArray(a), [
        2
    ], _toConsumableArray(a));
    var a8 = _toConsumableArray(a).concat(_toConsumableArray(a), _toConsumableArray(a));
}
function f1() {
    var a = [
        1,
        2,
        3
    ];
    var b = [
        "hello"
    ].concat(_toConsumableArray(a), [
        true
    ]);
    var b;
}
function f2() {
    var a = _toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray([])))));
    var b = _toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray([
        5
    ])))));
}
