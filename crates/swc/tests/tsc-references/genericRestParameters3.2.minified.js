//// [genericRestParameters3.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function bar() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return args;
}
f111("foo", "abc"), f111("foo", 10, !0), f111.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t1))), f111.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t2))), f111.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t3))), f111.apply(void 0, [
    "foo"
].concat(_to_consumable_array(t4))), f111("foo", 10), f111("foo"), f211 = f111, f311 = f111, f411 = f111, f111 = f211, foo(), foo(100), foo(foo), bar(10, 20), bar(10, 20), baz(), baz(1), baz(1, 2), baz.apply(void 0, _to_consumable_array(ca)), hmm(), hmm(1, "s"), hmm("what"), foo2.apply(void 0, _to_consumable_array([
    "hello"
])), ff211 = ff111 = ff211;
