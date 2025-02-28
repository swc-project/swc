var f = 0, o = 0;
function n(n) {
    if (1 == n) return;
    f++;
    if (2 == n) o = f;
}
n(0);
n(2);
console.log(o);
