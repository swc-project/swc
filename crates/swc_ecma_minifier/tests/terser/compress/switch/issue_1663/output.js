var a = 100, b = 10;
function f() {
    var b1;
    b1 = a++;
    return ++b1;
}
f();
console.log(a, b);
