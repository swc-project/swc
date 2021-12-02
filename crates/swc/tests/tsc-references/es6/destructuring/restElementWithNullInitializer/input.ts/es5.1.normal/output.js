function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function foo1() {
    var ref = _toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null), r = ref.slice(0);
}
function foo2() {
    var ref = _toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : undefined), r = ref.slice(0);
}
function foo3() {
    var ref = _toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
    }), r = ref.slice(0);
}
function foo4() {
    var ref = _toArray(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []), r = ref.slice(0);
}
