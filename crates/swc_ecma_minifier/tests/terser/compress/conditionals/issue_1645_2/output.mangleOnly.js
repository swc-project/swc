var n = 0;
function o() {
    return n++;
}
o() ? (n += 2) : (n += 4);
console.log(n);
