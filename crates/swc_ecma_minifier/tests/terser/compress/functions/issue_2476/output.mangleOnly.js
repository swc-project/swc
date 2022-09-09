function o(o, n, r) {
    return o < n ? o * n + r : o * r - n;
}
for (var n = 0, r = 0; r < 10; r++) n += o(r, r + 1, 3 * r);
console.log(n);
