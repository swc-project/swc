//// [mappedTypes6.ts]
function f1(x, y, z) {
    x = x;
    x = y; // Error
    x = z; // Error
    y = x;
    y = y;
    y = z; // Error
    z = x;
    z = y;
    z = z;
}
function f2(w, x, y, z) {
    w = w;
    w = x; // Error
    w = y; // Error
    w = z; // Error
    x = w;
    x = x;
    x = y; // Error
    x = z; // Error
    y = w;
    y = x;
    y = y;
    y = z; // Error
    z = w;
    z = x;
    z = y;
    z = z;
}
function f3(w, x, y, z) {
    w = {}; // Error
    x = {}; // Error
    y = {}; // Error
    z = {};
}
function f10(x, y, z) {
    x = x;
    x = y;
    x = z;
    y = x;
    y = y;
    y = z;
    z = x;
    z = y;
    z = z;
}
x1.a; // number
x1.b; // number | undefined
x1.c; // number | undefined
x1.d; // number | undefined
x1 = {
    a: 1
}; // Error
x1 = {
    a: 1,
    b: 1
};
x1 = {
    a: 1,
    b: 1,
    c: 1
};
x1 = {
    a: 1,
    b: 1,
    c: 1,
    d: 1
};
x1.a; // number
x1.b; // number | undefined
x1.c; // number
x1.d; // number
x2 = {
    a: 1
}; // Error
x2 = {
    a: 1,
    b: 1
}; // Error
x2 = {
    a: 1,
    b: 1,
    c: 1
}; // Error
x2 = {
    a: 1,
    b: 1,
    c: 1,
    d: 1
};
x3.a = 1;
x3.b = 1; // Error
x4.a = 1; // Error
x4.b = 1; // Error
x5.a = 1;
x5.b = 1;
