//// [callWithSpread.ts]
var _foo_apply, _foo_apply1, _foo_apply2, _foo_apply3, _xa_, _xa_1, _xa_2;
import "@swc/helpers/_/_call_super";
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_get";
import "@swc/helpers/_/_get_prototype_of";
import "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function foo(x, y) {
    for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
foo(1, 2, "abc"), foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0))), foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "abc"
])), (void 0).foo(1, 2, "abc"), (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0))), (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "abc"
])), (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0))).foo(1, 2, "abc"), (_foo_apply = (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0)))).foo.apply(_foo_apply, [
    1,
    2
].concat(_to_consumable_array(void 0))), (_foo_apply1 = (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0)))).foo.apply(_foo_apply1, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "abc"
])), (void 0).foo(1, 2, "abc"), (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0))), (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "abc"
])), (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0))).foo(1, 2, "abc"), (_foo_apply2 = (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0)))).foo.apply(_foo_apply2, [
    1,
    2
].concat(_to_consumable_array(void 0))), (_foo_apply3 = (void 0).foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(void 0)))).foo.apply(_foo_apply3, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "abc"
])), (void 0)[1].foo(1, 2, "abc"), (_xa_ = (void 0)[1]).foo.apply(_xa_, [
    1,
    2
].concat(_to_consumable_array(void 0))), (_xa_1 = (void 0)[1]).foo.apply(_xa_1, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "abc"
])), (_xa_2 = (void 0)[1]).foo.apply(_xa_2, [
    1,
    2,
    "abc"
]);
