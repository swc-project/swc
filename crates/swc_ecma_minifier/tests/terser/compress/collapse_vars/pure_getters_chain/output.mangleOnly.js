function n(n, o) {
    var r = n[1],
        c = n[2],
        e = n[3],
        l = n[5];
    return r <= 23 && c <= 59 && e <= 59 && (!o || l);
}
console.log(n([, 23, 59, 59, , 42], 1));
