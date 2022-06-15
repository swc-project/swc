function f1(x, y) {
    x = y;
    y = x; // Error
}
function f2(x, y) {
    x = y;
    y = x; // Error
    let s1 = x; // Error
    let s2 = y;
}
function f3(x, y) {
    x = y;
    y = x; // Error
}
function f4(x, y) {
    x = y;
    y = x; // Error
    let s1 = x; // Error
    let s2 = y;
}
let x0 = f5("a"); // { k: "a", a: number }
function f7(x, y, z) {
    x = y; // Error
    x = z; // Error
    y = x;
    y = z; // Error
    z = x;
    z = y; // Error
}
function f8(x, y, z) {
    x = y;
    x = z;
    y = x; // Error
    y = z; // Error
    z = x; // Error
    z = y; // Error
}
function f10(part) {
    let name = part.name;
    let id = part.subparts[0].id;
    part.id = part.id; // Error
    part.subparts[0] = part.subparts[0]; // Error
    part.subparts[0].id = part.subparts[0].id; // Error
    part.updatePart("hello"); // Error
}
function zeroOf(value) {
    return typeof value === "number" ? 0 : typeof value === "string" ? "" : false;
}
function f20(n, b, x, y) {
    zeroOf(5); // 0
    zeroOf("hello"); // ""
    zeroOf(true); // false
    zeroOf(n); // 0
    zeroOf(b); // False
    zeroOf(x); // 0 | false
    zeroOf(y); // ZeroOf<T>
}
function f21(x, y) {
    let z1 = y;
    let z2 = y;
    x = y; // Error
    y = x; // Error
}
function f22(x) {
    let e = x[0]; // {}
}
function f23(x) {
    let e = x[0]; // string
}
const convert = (value)=>value;
const convert2 = (value)=>value;
function f31() {
    var x;
    var x;
}
function f32() {
    var z;
    var z; // Error, T2 is distributive, T1 isn't
}
function f33() {
    var z;
    var z;
}
const f40 = (a)=>a;
const f41 = (a)=>a;
const f42 = (a)=>a;
const f43 = (a)=>a;
const f44 = (value)=>value;
const f45 = (value)=>value; // Error
// Repro from #21863
function f50() {}
var a = {
    o: 1,
    b: 2,
    c: [
        {
            a: 1,
            c: '213'
        }
    ]
};
assign(a, {
    o: 2,
    c: {
        0: {
            a: 2,
            c: '213123'
        }
    }
});
