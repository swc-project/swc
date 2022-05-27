function a(d) {
    var c = 0, a = new Array(2), b = d.charCodeAt(0);
    if (b < 2048) {
        a[c++] = 192 | (b >>> 6);
        a[c++] = 128 | (b & 63);
    } else {
        a[c++] = 224 | (b >>> 12);
        a[c++] = 128 | ((b >>> 6) & 63);
        a[c++] = 128 | (b & 63);
    }
    return a;
}
console.log(a("é"));
