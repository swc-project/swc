//// [callWithSpread.ts]
var _foo_apply, _foo_apply1, _foo_apply2, _foo_apply3, _xa_, _xa_1, _xa_2, a, obj, xa;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function foo(x, y) {
    for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
foo(1, 2, "abc"), foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(a))), foo.apply(void 0, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo(1, 2, "abc"), obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a))), obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc"), (_foo_apply = obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply, [
    1,
    2
].concat(_to_consumable_array(a))), (_foo_apply1 = obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo(1, 2, "abc"), obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a))), obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc"), (_foo_apply2 = obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply2, [
    1,
    2
].concat(_to_consumable_array(a))), (_foo_apply3 = obj.foo.apply(obj, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_foo_apply3, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), xa[1].foo(1, 2, "abc"), (_xa_ = xa[1]).foo.apply(_xa_, [
    1,
    2
].concat(_to_consumable_array(a))), (_xa_1 = xa[1]).foo.apply(_xa_1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), (_xa_2 = xa[1]).foo.apply(_xa_2, [
    1,
    2,
    "abc"
]);
