var n = 0,
    o = 0;
function f(f) {
    if (1 == f) return;
    n++;
    if (2 == f) o = n;
}
f(0);
f(2);
console.log(o);
