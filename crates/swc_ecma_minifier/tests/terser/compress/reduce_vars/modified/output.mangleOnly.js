function a() {
    var a = 1, b = 2;
    b++;
    console.log(a + 1);
    console.log(b + 1);
}
function b() {
    var a = 1, b = 2;
    --b;
    console.log(a + 1);
    console.log(b + 1);
}
function c() {
    var a = 1, b = 2, c = 3;
    b = c;
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function d() {
    var a = 1, b = 2, c = 3;
    b *= c;
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function e() {
    var a = 1, b = 2, c = 3;
    if (a) {
        b = c;
    } else {
        c = b;
    }
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function f(a) {
    B = a;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
a(), b(), c(), d(), e(), f();
