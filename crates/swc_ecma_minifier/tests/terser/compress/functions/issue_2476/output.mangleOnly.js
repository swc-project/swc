function r(r, n, o) {
    return r < n ? r * n + o : r * o - n;
}
for(var n = 0, o = 0; o < 10; o++)n += r(o, o + 1, 3 * o);
console.log(n);
