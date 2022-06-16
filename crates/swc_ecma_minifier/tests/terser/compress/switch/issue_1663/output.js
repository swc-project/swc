var a = 100, b = 10;
function f() {
    var b;
    b = a++;
    return ++b;
}
f();
console.log(a, b);
