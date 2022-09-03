//// [conditionalTypes1.ts]
function f1(x, y) {}
function f2(x, y) {}
function f3(x, y) {}
function f4(x, y) {}
var x0 = f5("a");
function f7(x, y, z) {
    x = y, y = x = z, y = z, z = x, z = y;
}
function f8(x, y, z) {
    x = y, y = x = z, y = z, z = x, z = y;
}
function f10(part) {
    part.name, part.subparts[0].id, part.id = part.id, part.subparts[0] = part.subparts[0], part.subparts[0].id = part.subparts[0].id, part.updatePart("hello");
}
function zeroOf(value) {
    return "number" == typeof value ? 0 : "string" == typeof value && "";
}
function f20(n, b, x, y) {
    zeroOf(5), zeroOf("hello"), zeroOf(!0), zeroOf(n), zeroOf(b), zeroOf(x), zeroOf(y);
}
function f21(x, y) {}
function f22(x) {
    x[0];
}
function f23(x) {
    x[0];
}
var convert = function(value) {
    return value;
}, convert2 = function(value) {
    return value;
};
function f31() {}
function f32() {}
function f33() {}
var f40 = function(a) {
    return a;
}, f41 = function(a) {
    return a;
}, f42 = function(a) {
    return a;
}, f43 = function(a) {
    return a;
}, f44 = function(value) {
    return value;
}, f45 = function(value) {
    return value;
};
function f50() {}
var a = {
    o: 1,
    b: 2,
    c: [
        {
            a: 1,
            c: "213"
        }
    ]
};
assign(a, {
    o: 2,
    c: {
        0: {
            a: 2,
            c: "213123"
        }
    }
});
