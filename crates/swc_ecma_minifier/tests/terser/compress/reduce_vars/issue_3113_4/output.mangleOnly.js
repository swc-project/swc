var o = 0, c = 0;
function n() {
    c += o;
}
n(n(), ++o);
console.log(o, c);
