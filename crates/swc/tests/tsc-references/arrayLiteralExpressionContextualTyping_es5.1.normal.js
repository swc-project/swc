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
// In a contextually typed array literal expression containing no spread elements, an element expression at index N is contextually typed by
//      the type of the property with the numeric name N in the contextual type, if any, or otherwise
//      the numeric index type of the contextual type, if any.
var array = [
    1,
    2,
    3
];
var array1 = [
    true,
    2,
    3
]; // Contextual type by the numeric index type of the contextual type
var tup = [
    1,
    2,
    3,
    4
];
var tup1 = [
    1,
    2,
    3,
    "string"
];
var tup2 = [
    1,
    2,
    3,
    "string"
]; // Error
// In a contextually typed array literal expression containing one or more spread elements,
// an element expression at index N is contextually typed by the numeric index type of the contextual type, if any.
var spr = [
    1,
    2,
    3
].concat(_toConsumableArray(array));
var spr1 = [
    1,
    2,
    3
].concat(_toConsumableArray(tup));
var spr2 = [
    1,
    2,
    3
].concat(_toConsumableArray(tup)); // Error
