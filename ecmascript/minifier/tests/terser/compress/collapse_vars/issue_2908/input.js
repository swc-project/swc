var a = 0,
    b = 0;
function f(c) {
    if (1 == c) return;
    a++;
    if (2 == c) b = a;
}
f(0);
f(2);
console.log(b);
