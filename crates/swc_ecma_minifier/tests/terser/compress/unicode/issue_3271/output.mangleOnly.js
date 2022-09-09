function e(e) {
    var r = 0,
        n = new Array(2),
        o = e.charCodeAt(0);
    if (o < 2048) {
        n[r++] = 192 | (o >>> 6);
        n[r++] = 128 | (o & 63);
    } else {
        n[r++] = 224 | (o >>> 12);
        n[r++] = 128 | ((o >>> 6) & 63);
        n[r++] = 128 | (o & 63);
    }
    return n;
}
console.log(e("é"));
