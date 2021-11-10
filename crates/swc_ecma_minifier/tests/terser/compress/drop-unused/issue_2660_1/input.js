var a = 2;
function f(b) {
    return (b && f()) || a--;
}
f(1);
console.log(a);
