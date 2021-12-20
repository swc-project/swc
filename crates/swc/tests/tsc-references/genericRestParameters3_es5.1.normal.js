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
f1("foo", "abc");
f1("foo", 10, true);
f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t1)));
f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t2)));
f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t3)));
f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t4)));
f1("foo", 10); // Error
f1("foo"); // Error
f2 = f1;
f3 = f1;
f4 = f1; // Error, misaligned complex rest types
f1 = f2; // Error
f1 = f3; // Error
f1 = f4; // Error, misaligned complex rest types
foo(); // Error
foo(100); // Error
foo(foo); // Error
function bar() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return args;
}
var a = bar(10, 20);
var b = bar(10, 20); // Error
baz(); // Error
baz(1); // Error
baz(1, 2); // Error
baz.apply(void 0, _toConsumableArray(ca)); // Error
hmm(); // okay, A = []
hmm(1, "s"); // okay, A = [1, "s"]
hmm("what"); // no error?  A = [] | [number, string] ?
var x2 = [
    "hello"
];
foo2.apply(void 0, _toConsumableArray(x2));
