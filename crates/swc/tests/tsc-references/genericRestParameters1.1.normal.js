//// [genericRestParameters1.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
f1 = f2;
f2 = f1;
f1(42, "hello", true);
f1(t3[0], t3[1], t3[2]);
f1.apply(void 0, _to_consumable_array(t3));
f1.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f1.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1)));
f1.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t0)));
f1(ns[0], ns[1], true);
f1.apply(void 0, _to_consumable_array(ns).concat([
    true
])); // FIXME: Error, since ...ns is considered as string|number here
f2(42, "hello", true);
f2(t3[0], t3[1], t3[2]);
f2.apply(void 0, _to_consumable_array(t3));
f2.apply(void 0, [
    42
].concat(_to_consumable_array(t2)));
f2.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1)));
f2.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t0)));
f2(ns[0], ns[1], true);
f2.apply(void 0, _to_consumable_array(ns).concat([
    true
])); // FIXME: Error, since ...ns is considered as string|number here
var x10 = f10(42, "hello", true); // [number, string, boolean]
var x11 = f10(42, "hello"); // [number, string]
var x12 = f10(42); // [number]
var x13 = f10(); // []
var x14 = f10.apply(void 0, _to_consumable_array(t3)); // [number, string, boolean]
var x15 = f10.apply(void 0, [
    42
].concat(_to_consumable_array(t2))); // [number, string, boolean]
var x16 = f10.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))); // [number, string, boolean]
var x17 = f10.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t0))); // [number, string, boolean]
var x18 = f10.apply(void 0, _to_consumable_array(ns).concat([
    true
])); // (string | number | boolean)[]
function g10(u, v) {
    var x1 = f10.apply(void 0, _to_consumable_array(u)); // U
    var x2 = f10.apply(void 0, _to_consumable_array(v)); // V
    var x3 = f10.apply(void 0, [
        1
    ].concat(_to_consumable_array(u))); // [number, ...string[]]
    var x4 = f10.apply(void 0, _to_consumable_array(u).concat(_to_consumable_array(v))); // (string | number)[]
}
var z10 = f11(42, "hello", true); // [42, "hello", true]
var z11 = f11(42, "hello"); // [42, "hello"]
var z12 = f11(42); // [42]
var z13 = f11(); // []
var z14 = f11.apply(void 0, _to_consumable_array(t3)); // [number, string, boolean]
var z15 = f11.apply(void 0, [
    42
].concat(_to_consumable_array(t2))); // [42, string, boolean]
var z16 = f11.apply(void 0, [
    42,
    "hello"
].concat(_to_consumable_array(t1))); // [42, "hello", boolean]
var z17 = f11.apply(void 0, [
    42,
    "hello",
    true
].concat(_to_consumable_array(t0))); // [42, "hello", true]
var z18 = f11.apply(void 0, _to_consumable_array(ns).concat([
    true
])); // (string | number | true)[]
function g11(u, v) {
    var x1 = f11.apply(void 0, _to_consumable_array(u)); // U
    var x2 = f11.apply(void 0, _to_consumable_array(v)); // V
    var x3 = f11.apply(void 0, [
        1
    ].concat(_to_consumable_array(u))); // [1, ...string[]]
    var x4 = f11.apply(void 0, _to_consumable_array(u).concat(_to_consumable_array(v))); // (string | number)[]
}
function call(f) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    return f.apply(void 0, _to_consumable_array(args));
}
function callr(args, f) {
    return f.apply(void 0, _to_consumable_array(args));
}
var x20 = call(function(x, y) {
    return x + y;
}, 10, 20); // number
var x21 = call(function(x, y) {
    return x + y;
}, 10, "hello"); // string
var x22 = call(f15, "hello", 42); // string | number
var x23 = call(f16, "hello", 42); // unknown
var x24 = call(f16, "hello", 42); // string | number
var x30 = callr(sn, function(x, y) {
    return x + y;
}); // string
var x31 = callr(sn, f15); // string | number
var x32 = callr(sn, f16); // string | number
function bind(f, x) {
    return function() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
            rest[_key] = arguments[_key];
        }
        return f.apply(void 0, [
            x
        ].concat(_to_consumable_array(rest)));
    };
}
var f21 = bind(f20, 42); // (y: string, z: boolean) => string[]
var f22 = bind(f21, "hello"); // (z: boolean) => string[]
var f23 = bind(f22, true); // () => string[]
f20(42, "hello", true);
f21("hello", true);
f22(true);
f23();
var g21 = bind(g20, 42); // (y: string, z: boolean) => string[]
var g22 = bind(g21, "hello"); // (z: boolean) => string[]
var g23 = bind(g22, true); // () => string[]
g20(42, "hello", true);
g20(42, "hello");
g20(42);
g21("hello", true);
g21("hello");
g21();
g22(true);
g22();
g23();
var c30 = f30(42, function(x) {
    return "" + x;
}, function(x) {
    return x + 1;
}); // [(x: number) => string, (x: number) => number]
events.emit('move', 10, 'left');
events.emit('jump', 20, 'up');
events.emit('stop', 'Bye!');
events.emit('done');
ff1 = ff2;
ff1 = ff3;
ff1 = ff4; // Error
