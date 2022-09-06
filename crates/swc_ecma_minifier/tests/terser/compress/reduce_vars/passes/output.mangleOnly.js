function o() {
    var o = 1,
        l = 2,
        e = 3;
    if (o) {
        l = e;
    } else {
        e = l;
    }
    console.log(o + l);
    console.log(l + e);
    console.log(o + e);
    console.log(o + l + e);
}
