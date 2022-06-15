function a(a) {
    var b = 0, c = new Array(2), d = a.charCodeAt(0);
    if (d < 2048) {
        c[b++] = 192 | (d >>> 6);
        c[b++] = 128 | (d & 63);
    } else {
        c[b++] = 224 | (d >>> 12);
        c[b++] = 128 | ((d >>> 6) & 63);
        c[b++] = 128 | (d & 63);
    }
    return c;
}
console.log(a("é"));
