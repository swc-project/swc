function a() {
    var b = 1, a = 2;
    a++;
    console.log(b + 1);
    console.log(a + 1);
}
function b() {
    var b = 1, a = 2;
    --a;
    console.log(b + 1);
    console.log(a + 1);
}
function c() {
    var c = 1, a = 2, b = 3;
    a = b;
    console.log(c + a);
    console.log(a + b);
    console.log(c + b);
    console.log(c + a + b);
}
function d() {
    var c = 1, a = 2, b = 3;
    a *= b;
    console.log(c + a);
    console.log(a + b);
    console.log(c + b);
    console.log(c + a + b);
}
function e() {
    var c = 1, a = 2, b = 3;
    if (c) {
        a = b;
    } else {
        b = a;
    }
    console.log(c + a);
    console.log(a + b);
    console.log(c + b);
    console.log(c + a + b);
}
function f(a) {
    B = a;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
a(), b(), c(), d(), e(), f();
