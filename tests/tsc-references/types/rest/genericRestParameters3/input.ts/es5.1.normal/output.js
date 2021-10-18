function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
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
