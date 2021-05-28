var a = 0,
    b = 0;
function f() {
    b += a;
}
f(f(), ++a);
console.log(a, b);
