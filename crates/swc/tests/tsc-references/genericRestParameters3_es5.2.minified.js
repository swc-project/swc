import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
function bar() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return args;
}
f1("foo", "abc"), f1("foo", 10, !0), f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t1))), f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t2))), f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t3))), f1.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t4))), f1("foo", 10), f1("foo"), f2 = f1, f3 = f1, f4 = f1, f1 = f2, f1 = f3, f1 = f4, foo(), foo(100), foo(foo), bar(10, 20), bar(10, 20), baz(), baz(1), baz(1, 2), baz.apply(void 0, _to_consumable_array(ca)), hmm(), hmm(1, "s"), hmm("what"), foo2.apply(void 0, _to_consumable_array([
    "hello"
]));
