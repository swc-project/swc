function isBetween(x, a, b) {
    var ref;
    if (a > b) ref = [
        b,
        a
    ], a = ref[0], b = ref[1], ref;
    return x > a && x < b;
}
