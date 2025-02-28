function n(o, n, r) {
    return o < n ? o * n + r : o * r - n;
}
for(var o = 0, r = 0; r < 10; r++)o += n(r, r + 1, 3 * r);
console.log(o);
