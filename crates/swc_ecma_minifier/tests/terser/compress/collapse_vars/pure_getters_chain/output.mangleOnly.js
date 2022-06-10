function a(a, b) {
    var c = a[1], d = a[2], e = a[3], f = a[5];
    return c <= 23 && d <= 59 && e <= 59 && (!b || f);
}
console.log(a([
    ,
    23,
    59,
    59,
    ,
    42
], 1));
