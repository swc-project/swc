function f0() {
    var a = 1,
        b = 2;
    b++;
    console.log(a + 1);
    console.log(b + 1);
}
function f1() {
    var a = 1,
        b = 2;
    --b;
    console.log(a + 1);
    console.log(b + 1);
}
function f2() {
    var a = 1,
        b = 2,
        c = 3;
    b = c;
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function f3() {
    var a = 1,
        b = 2,
        c = 3;
    b *= c;
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function f4() {
    var a = 1,
        b = 2,
        c = 3;
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
function f5(a) {
    B = a;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
f0(), f1(), f2(), f3(), f4(), f5();
