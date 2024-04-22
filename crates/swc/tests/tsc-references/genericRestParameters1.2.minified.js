//// [genericRestParameters1.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function call(f) {
    for(var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
    return f.apply(void 0, _to_consumable_array(args));
}
function callr(args, f) {
    return f.apply(void 0, _to_consumable_array(args));
}
function bind(f, x) {
    return function() {
        for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
        return f.apply(void 0, [
            x
        ].concat(_to_consumable_array(rest)));
    };
}
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
])), f10(42, "hello", !0), f10(42, "hello"), f10(42), f10(), f10.apply(void 0, _to_consumable_array(t3)), f10.apply(void 0, [
    42
].concat(_to_consumable_array(t2))), f10.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))), f10.apply(void 0, [
    42,
    "hello",
    !0
].concat(_to_consumable_array(t0))), f10.apply(void 0, _to_consumable_array(ns).concat([
    !0
])), f11(42, "hello", !0), f11(42, "hello"), f11(42), f11(), f11.apply(void 0, _to_consumable_array(t3)), f11.apply(void 0, [
    42
].concat(_to_consumable_array(t2))), f11.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))), f11.apply(void 0, [
    42,
    "hello",
    !0
].concat(_to_consumable_array(t0))), f11.apply(void 0, _to_consumable_array(ns).concat([
    !0
])), call(function(x, y) {
    return x + y;
}, 10, 20), call(function(x, y) {
    return x + y;
}, 10, "hello"), call(f15, "hello", 42), call(f16, "hello", 42), call(f16, "hello", 42), callr(sn, function(x, y) {
    return x + y;
}), callr(sn, f15), callr(sn, f16);
var f21 = bind(f20, 42), f22 = bind(f21, "hello"), f23 = bind(f22, !0);
f20(42, "hello", !0), f21("hello", !0), f22(!0), f23();
var g21 = bind(g20, 42), g22 = bind(g21, "hello"), g23 = bind(g22, !0);
g20(42, "hello", !0), g20(42, "hello"), g20(42), g21("hello", !0), g21("hello"), g21(), g22(!0), g22(), g23(), f30(42, function(x) {
    return "" + x;
}, function(x) {
    return x + 1;
}), events.emit('move', 10, 'left'), events.emit('jump', 20, 'up'), events.emit('stop', 'Bye!'), events.emit('done'), ff1 = ff2, ff1 = ff3, ff1 = ff4;
