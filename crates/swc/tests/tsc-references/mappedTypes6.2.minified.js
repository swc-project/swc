//// [mappedTypes6.ts]
function f1(x, y, z) {
    x = y, y = x = z, y = z, z = x, z = y;
}
function f2(w, x, y, z) {
    w = x, w = y, x = w = z, x = y, x = z, y = w, y = x, y = z, z = w, z = x, z = y;
}
function f3(w, x, y, z) {}
function f10(x, y, z) {
    x = y, y = x = z, y = z, z = x, z = y;
}
x1.a, x1.b, x1.c, x1.d, x1 = {
    a: 1
}, x1 = {
    a: 1,
    b: 1
}, x1 = {
    a: 1,
    b: 1,
    c: 1
}, (x1 = {
    a: 1,
    b: 1,
    c: 1,
    d: 1
}).a, x1.b, x1.c, x1.d, x2 = {
    a: 1
}, x2 = {
    a: 1,
    b: 1
}, x2 = {
    a: 1,
    b: 1,
    c: 1
}, x2 = {
    a: 1,
    b: 1,
    c: 1,
    d: 1
}, x3.a = 1, x3.b = 1, x4.a = 1, x4.b = 1, x5.a = 1, x5.b = 1;
