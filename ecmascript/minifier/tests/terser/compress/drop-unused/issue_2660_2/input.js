var a = 1;
function f(b) {
    b && f();
    --a, a.toString();
}
f();
console.log(a);
