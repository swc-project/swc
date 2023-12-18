var n = 0, o = 0;
function f(o) {
    if (1 == o) return;
    n++;
    if (2 == o) o = n;
}
f(0);
f(2);
console.log(o);
