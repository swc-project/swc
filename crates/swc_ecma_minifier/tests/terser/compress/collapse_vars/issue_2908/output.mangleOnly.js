var a = 0, b = 0;
function c(c) {
    if (1 == c) return;
    a++;
    if (2 == c) b = a;
}
c(0);
c(2);
console.log(b);
