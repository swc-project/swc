function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
}
function bar() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return args;
}
f1("foo", "abc"), f1("foo", 10, !0), f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t1))), f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t2))), f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t3))), f1.apply(void 0, [
    "foo"
].concat(_toConsumableArray(t4))), f1("foo", 10), f1("foo"), f2 = f1, f3 = f1, f4 = f1, f1 = f2, f1 = f3, f1 = f4, foo(), foo(100), foo(foo), bar(10, 20), bar(10, 20), baz(), baz(1), baz(1, 2), baz.apply(void 0, _toConsumableArray(ca)), hmm(), hmm(1, "s"), hmm("what"), foo2.apply(void 0, _toConsumableArray([
    "hello"
]));
