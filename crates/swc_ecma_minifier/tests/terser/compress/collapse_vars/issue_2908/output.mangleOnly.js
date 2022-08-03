var f = 0, i = 0;
function n(n) {
    if (1 == n) return;
    f++;
    if (2 == n) i = f;
}
n(0);
n(2);
console.log(i);
