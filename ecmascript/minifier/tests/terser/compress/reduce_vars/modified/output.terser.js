function f0() {
    var b = 2;
    b++;
    console.log(2);
    console.log(4);
}
function f1() {
    var b = 2;
    --b;
    console.log(2);
    console.log(2);
}
function f2() {
    3;
    console.log(4);
    console.log(6);
    console.log(4);
    console.log(7);
}
function f3() {
    var b = 2;
    b *= 3;
    console.log(7);
    console.log(9);
    console.log(4);
    console.log(10);
}
function f4() {
    var b = 2,
        c = 3;
    b = c;
    console.log(1 + b);
    console.log(b + c);
    console.log(1 + c);
    console.log(1 + b + c);
}
function f5(a) {
    B = a;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
f0(), f1(), f2(), f3(), f4(), f5();
