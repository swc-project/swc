f1 = f2;
f2 = f1;
f1(42, "hello", true);
f1(t3[0], t3[1], t3[2]);
f1(...t3);
f1(42, ...t2);
f1(42, "hello", ...t1);
f1(42, "hello", true, ...t0);
f1(ns[0], ns[1], true);
f1(...ns, true); // FIXME: Error, since ...ns is considered as string|number here
f2(42, "hello", true);
f2(t3[0], t3[1], t3[2]);
f2(...t3);
f2(42, ...t2);
f2(42, "hello", ...t1);
f2(42, "hello", true, ...t0);
f2(ns[0], ns[1], true);
f2(...ns, true); // FIXME: Error, since ...ns is considered as string|number here
const x10 = f10(42, "hello", true); // [number, string, boolean]
const x11 = f10(42, "hello"); // [number, string]
const x12 = f10(42); // [number]
const x13 = f10(); // []
const x14 = f10(...t3); // [number, string, boolean]
const x15 = f10(42, ...t2); // [number, string, boolean]
const x16 = f10(42, "hello", ...t1); // [number, string, boolean]
const x17 = f10(42, "hello", true, ...t0); // [number, string, boolean]
const x18 = f10(...ns, true); // (string | number | boolean)[]
function g10(u, v) {
    let x1 = f10(...u); // U
    let x2 = f10(...v); // V
    let x3 = f10(1, ...u); // [number, ...string[]]
    let x4 = f10(...u, ...v); // (string | number)[]
}
const z10 = f11(42, "hello", true); // [42, "hello", true]
const z11 = f11(42, "hello"); // [42, "hello"]
const z12 = f11(42); // [42]
const z13 = f11(); // []
const z14 = f11(...t3); // [number, string, boolean]
const z15 = f11(42, ...t2); // [42, string, boolean]
const z16 = f11(42, "hello", ...t1); // [42, "hello", boolean]
const z17 = f11(42, "hello", true, ...t0); // [42, "hello", true]
const z18 = f11(...ns, true); // (string | number | true)[]
function g11(u, v) {
    let x1 = f11(...u); // U
    let x2 = f11(...v); // V
    let x3 = f11(1, ...u); // [1, ...string[]]
    let x4 = f11(...u, ...v); // (string | number)[]
}
function call(f, ...args) {
    return f(...args);
}
function callr(args, f) {
    return f(...args);
}
let x20 = call((x, y)=>x + y, 10, 20); // number
let x21 = call((x, y)=>x + y, 10, "hello"); // string
let x22 = call(f15, "hello", 42); // string | number
let x23 = call(f16, "hello", 42); // unknown
let x24 = call(f16, "hello", 42); // string | number
let x30 = callr(sn, (x, y)=>x + y); // string
let x31 = callr(sn, f15); // string | number
let x32 = callr(sn, f16); // string | number
function bind(f, x) {
    return (...rest)=>f(x, ...rest);
}
const f21 = bind(f20, 42); // (y: string, z: boolean) => string[]
const f22 = bind(f21, "hello"); // (z: boolean) => string[]
const f23 = bind(f22, true); // () => string[]
f20(42, "hello", true);
f21("hello", true);
f22(true);
f23();
const g21 = bind(g20, 42); // (y: string, z: boolean) => string[]
const g22 = bind(g21, "hello"); // (z: boolean) => string[]
const g23 = bind(g22, true); // () => string[]
g20(42, "hello", true);
g20(42, "hello");
g20(42);
g21("hello", true);
g21("hello");
g21();
g22(true);
g22();
g23();
const c30 = f30(42, (x)=>"" + x, (x)=>x + 1); // [(x: number) => string, (x: number) => number]
events.emit('move', 10, 'left');
events.emit('jump', 20, 'up');
events.emit('stop', 'Bye!');
events.emit('done');
ff1 = ff2;
ff1 = ff3;
ff1 = ff4; // Error
