function string2buf(str) {
    var i = 0,
        buf = new Array(2),
        c = str.charCodeAt(0);
    if (c < 2048) {
        buf[i++] = 192 | (c >>> 6);
        buf[i++] = 128 | (c & 63);
    } else {
        buf[i++] = 224 | (c >>> 12);
        buf[i++] = 128 | ((c >>> 6) & 63);
        buf[i++] = 128 | (c & 63);
    }
    return buf;
}
console.log(string2buf("é"));
