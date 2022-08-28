//// [callWithSpread.ts]
var _obj, _obj1, _obj2, _obj3, _instance, _obj4, _instance1, _obj5, _obj6, _obj7, _obj8, _instance2, _obj9, _instance3, _instance4, _instance5, _instance6, a, obj, xa;
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
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
])), obj.foo(1, 2, "abc"), (_obj = obj).foo.apply(_obj, [
    1,
    2
].concat(_to_consumable_array(a))), (_obj1 = obj).foo.apply(_obj1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), (_obj2 = obj).foo.apply(_obj2, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc"), (_instance = (_obj3 = obj).foo.apply(_obj3, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_instance, [
    1,
    2
].concat(_to_consumable_array(a))), (_instance1 = (_obj4 = obj).foo.apply(_obj4, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_instance1, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), obj.foo(1, 2, "abc"), (_obj5 = obj).foo.apply(_obj5, [
    1,
    2
].concat(_to_consumable_array(a))), (_obj6 = obj).foo.apply(_obj6, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), (_obj7 = obj).foo.apply(_obj7, [
    1,
    2
].concat(_to_consumable_array(a))).foo(1, 2, "abc"), (_instance2 = (_obj8 = obj).foo.apply(_obj8, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_instance2, [
    1,
    2
].concat(_to_consumable_array(a))), (_instance3 = (_obj9 = obj).foo.apply(_obj9, [
    1,
    2
].concat(_to_consumable_array(a)))).foo.apply(_instance3, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), xa[1].foo(1, 2, "abc"), (_instance4 = xa[1]).foo.apply(_instance4, [
    1,
    2
].concat(_to_consumable_array(a))), (_instance5 = xa[1]).foo.apply(_instance5, [
    1,
    2
].concat(_to_consumable_array(a), [
    "abc"
])), (_instance6 = xa[1]).foo.apply(_instance6, [
    1,
    2,
    "abc"
]);
