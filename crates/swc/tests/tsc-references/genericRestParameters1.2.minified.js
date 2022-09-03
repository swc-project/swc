//// [genericRestParameters1.ts]
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
f2 = f1 = f2, f1(42, "hello", !0), f1(t3[0], t3[1], t3[2]), f1.apply(void 0, _to_consumable_array(t3)), f1.apply(void 0, [
    42
].concat(_to_consumable_array(t2))), f1.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))), f1.apply(void 0, [
    42,
    "hello",
    !0
].concat(_to_consumable_array(t0))), f1(ns[0], ns[1], !0), f1.apply(void 0, _to_consumable_array(ns).concat([
    !0
])), f2(42, "hello", !0), f2(t3[0], t3[1], t3[2]), f2.apply(void 0, _to_consumable_array(t3)), f2.apply(void 0, [
    42
].concat(_to_consumable_array(t2))), f2.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))), f2.apply(void 0, [
    42,
    "hello",
    !0
].concat(_to_consumable_array(t0))), f2(ns[0], ns[1], !0), f2.apply(void 0, _to_consumable_array(ns).concat([
    !0
]));
var x10 = f10(42, "hello", !0), x11 = f10(42, "hello"), x12 = f10(42), x13 = f10(), x14 = f10.apply(void 0, _to_consumable_array(t3)), x15 = f10.apply(void 0, [
    42
].concat(_to_consumable_array(t2))), x16 = f10.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))), x17 = f10.apply(void 0, [
    42,
    "hello",
    !0
].concat(_to_consumable_array(t0))), x18 = f10.apply(void 0, _to_consumable_array(ns).concat([
    !0
]));
function g10(u, v) {
    f10.apply(void 0, _to_consumable_array(u)), f10.apply(void 0, _to_consumable_array(v)), f10.apply(void 0, [
        1
    ].concat(_to_consumable_array(u))), f10.apply(void 0, _to_consumable_array(u).concat(_to_consumable_array(v)));
}
var z10 = f11(42, "hello", !0), z11 = f11(42, "hello"), z12 = f11(42), z13 = f11(), z14 = f11.apply(void 0, _to_consumable_array(t3)), z15 = f11.apply(void 0, [
    42
].concat(_to_consumable_array(t2))), z16 = f11.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))), z17 = f11.apply(void 0, [
    42,
    "hello",
    !0
].concat(_to_consumable_array(t0))), z18 = f11.apply(void 0, _to_consumable_array(ns).concat([
    !0
]));
function g11(u, v) {
    f11.apply(void 0, _to_consumable_array(u)), f11.apply(void 0, _to_consumable_array(v)), f11.apply(void 0, [
        1
    ].concat(_to_consumable_array(u))), f11.apply(void 0, _to_consumable_array(u).concat(_to_consumable_array(v)));
}
function call(f) {
    for(var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
    return f.apply(void 0, _to_consumable_array(args));
}
function callr(args, f) {
    return f.apply(void 0, _to_consumable_array(args));
}
var x20 = call(function(x, y) {
    return x + y;
}, 10, 20), x21 = call(function(x, y) {
    return x + y;
}, 10, "hello"), x22 = call(f15, "hello", 42), x23 = call(f16, "hello", 42), x24 = call(f16, "hello", 42), x30 = callr(sn, function(x, y) {
    return x + y;
}), x31 = callr(sn, f15), x32 = callr(sn, f16);
function bind(f, x) {
    return function() {
        for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
        return f.apply(void 0, [
            x
        ].concat(_to_consumable_array(rest)));
    };
}
var f21 = bind(f20, 42), f22 = bind(f21, "hello"), f23 = bind(f22, !0);
f20(42, "hello", !0), f21("hello", !0), f22(!0), f23();
var g21 = bind(g20, 42), g22 = bind(g21, "hello"), g23 = bind(g22, !0);
g20(42, "hello", !0), g20(42, "hello"), g20(42), g21("hello", !0), g21("hello"), g21(), g22(!0), g22(), g23();
var c30 = f30(42, function(x) {
    return "" + x;
}, function(x) {
    return x + 1;
});
events.emit("move", 10, "left"), events.emit("jump", 20, "up"), events.emit("stop", "Bye!"), events.emit("done"), ff1 = ff2, ff1 = ff3, ff1 = ff4;
