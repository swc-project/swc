var o = 0,
    n = 0;
function c() {
    n += o;
}
c(c(), ++o);
console.log(o, n);
