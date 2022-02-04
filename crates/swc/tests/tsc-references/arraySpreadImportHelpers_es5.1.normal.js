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
function _unsupportedIterableToArray(o1, minLen) {
    if (!o1) return;
    if (typeof o1 === "string") return _arrayLikeToArray(o1, minLen);
    var n = Object.prototype.toString.call(o1).slice(8, -1);
    if (n === "Object" && o1.constructor) n = o1.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o1, minLen);
}
var k = [
    1,
    ,
    2
];
var o = [
    3
].concat(_toConsumableArray(k), [
    4
]);
// @target: es5
// @importHelpers: true
// @isolatedModules: true
// @noTypesAndSymbols: true
// @noEmit: true
// @filename: main.ts
export { };
