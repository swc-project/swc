//// [conditionalTypes1.ts]
function f1(x, y) {
    x = y;
    y = x; // Error
}
function f2(x, y) {
    x = y;
    y = x; // Error
    var s1 = x; // Error
    var s2 = y;
}
function f3(x, y) {
    x = y;
    y = x; // Error
}
function f4(x, y) {
    x = y;
    y = x; // Error
    var s1 = x; // Error
    var s2 = y;
}
var x0 = f5("a"); // { k: "a", a: number }
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
    var name = part.name;
    var id = part.subparts[0].id;
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
    var z1 = y;
    var z2 = y;
    x = y; // Error
    y = x; // Error
}
function f22(x) {
    var e = x[0]; // {}
}
function f23(x) {
    var e = x[0]; // string
}
var convert = function(value) {
    return value;
};
var convert2 = function(value) {
    return value;
};
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
var f40 = function(a) {
    return a;
};
var f41 = function(a) {
    return a;
};
var f42 = function(a) {
    return a;
};
var f43 = function(a) {
    return a;
};
var f44 = function(value) {
    return value;
};
var f45 = function(value) {
    return value;
}; // Error
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
