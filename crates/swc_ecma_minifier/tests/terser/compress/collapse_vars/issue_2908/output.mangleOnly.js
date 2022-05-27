var c = 0, b = 0;
function a(a) {
    if (1 == a) return;
    c++;
    if (2 == a) b = c;
}
a(0);
a(2);
console.log(b);
