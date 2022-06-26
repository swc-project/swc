var a = 0, b = 0;
function c() {
    b += a;
}
c(c(), ++a);
console.log(a, b);
