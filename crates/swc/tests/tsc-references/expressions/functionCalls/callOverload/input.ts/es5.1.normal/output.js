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
    var n1 = Object.prototype.toString.call(o).slice(8, -1);
    if (n1 === "Object" && o.constructor) n1 = o.constructor.name;
    if (n1 === "Map" || n1 === "Set") return Array.from(n1);
    if (n1 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n1)) return _arrayLikeToArray(o, minLen);
}
var n;
fn(1) // no error
;
fn(1, 2, 3, 4);
takeTwo(1, 2, 3, 4);
withRest.apply(void 0, [
    'a'
].concat(_toConsumableArray(n))); // no error
withRest();
withRest.apply(void 0, _toConsumableArray(n));
