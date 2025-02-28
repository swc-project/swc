function e(e) {
    var o = 0, r = new Array(2), n = e.charCodeAt(0);
    if (n < 2048) {
        r[o++] = 192 | (n >>> 6);
        r[o++] = 128 | (n & 63);
    } else {
        r[o++] = 224 | (n >>> 12);
        r[o++] = 128 | ((n >>> 6) & 63);
        r[o++] = 128 | (n & 63);
    }
    return r;
}
console.log(e("é"));
