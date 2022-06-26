import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
f10(42, "hello");
f10(42, "hello", true);
f10(42, "hello", true, false);
f10(t1[0], t1[1], t1[2], t1[3]);
f10.apply(void 0, _to_consumable_array(t1));
f10.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f10.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t3)));
f10.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4)));
f10.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4), [
    false
], _to_consumable_array(t3)));
f11(42, "hello");
f11(42, "hello", true);
f11(42, "hello", true, false);
f11(t1[0], t1[1], t1[2], t1[3]);
f11.apply(void 0, _to_consumable_array(t1));
f11.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f11.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t3)));
f11.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4)));
f11.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4), [
    false
], _to_consumable_array(t3)));
f12(42, "hello");
f12(42, "hello", true);
f12(42, "hello", true, false);
f12(t1[0], t1[1], t1[2], t1[3]);
f12.apply(void 0, _to_consumable_array(t1));
f12.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f12.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t3)));
f12.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4)));
f12.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4), [
    false
], _to_consumable_array(t3)));
f13(42, "hello");
f13(42, "hello", true);
f13(42, "hello", true, false);
f13(t1[0], t1[1], t1[2], t1[3]);
f13.apply(void 0, _to_consumable_array(t1));
f13.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f13.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t3)));
f13.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4)));
f13.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t4), [
    false
], _to_consumable_array(t3)));
f20.apply(void 0, _to_consumable_array(t1));
f20.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f20.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t3)));
f20.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t2), [
    true
]));
