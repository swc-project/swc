//// [newWithSpreadES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _construct } from "@swc/helpers/_/_construct";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function f(x, y) {
    for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
var B = function B(x, y) {
    for(var _len = arguments.length, z = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
    _class_call_check(this, B);
};
new f(1, 2, "string"), _construct(f, [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct(f, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), _construct(function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}, _to_consumable_array(void 0).concat(_to_consumable_array(void 0))), _construct(f, [
    1,
    2
].concat(_to_consumable_array(void 0), _to_consumable_array(void 0))), new f(1, 2, "string")(), _construct(f, [
    1,
    2
].concat(_to_consumable_array(void 0)))(), _construct(f, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
]))(), new (void 0).f(1, 2, "string"), _construct((void 0).f, [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0).f, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0).f(1, 2, "string"), _construct((void 0).f, [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0).f, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)[1].f(1, 2, "string"), _construct((void 0)[1].f, [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)[1].f, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)["a-b"].f(1, 2, "string"), _construct((void 0)["a-b"].f, [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)["a-b"].f, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new B(1, 2, "string"), _construct(B, [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct(B, [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)["a-b"](1, 2, "string"), _construct((void 0)["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)["a-b"](1, 2, "string"), _construct((void 0)["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)[1]["a-b"](1, 2, "string"), _construct((void 0)[1]["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)[1]["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)["a-b"]["a-b"](1, 2, "string"), _construct((void 0)["a-b"]["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)["a-b"]["a-b"], [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
])), new (void 0)["a-b"][1](1, 2, "string"), _construct((void 0)["a-b"][1], [
    1,
    2
].concat(_to_consumable_array(void 0))), _construct((void 0)["a-b"][1], [
    1,
    2
].concat(_to_consumable_array(void 0), [
    "string"
]));
