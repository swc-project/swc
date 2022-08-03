function e(e) {
    var _ = 0, n = new Array(2), r = e.charCodeAt(0);
    if (r < 2048) {
        n[_++] = 192 | (r >>> 6);
        n[_++] = 128 | (r & 63);
    } else {
        n[_++] = 224 | (r >>> 12);
        n[_++] = 128 | ((r >>> 6) & 63);
        n[_++] = 128 | (r & 63);
    }
    return n;
}
console.log(e("é"));
