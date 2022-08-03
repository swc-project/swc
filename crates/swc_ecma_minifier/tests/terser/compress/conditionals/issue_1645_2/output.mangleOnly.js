var n = 0;
function r() {
    return n++;
}
r() ? (n += 2) : (n += 4);
console.log(n);
