var n = 1;
function o(t) {
    t && o();
    --n, n.toString();
}
o();
console.log(n);
