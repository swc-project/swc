function te(a) {
    var b, c, d, e, f;
    if (isNaN(a)) {
        return Qe(), Pe;
    }
    if (a < -9223372036854775808) {
        return Qe(), Ne;
    }
    if (a >= 9223372036854775807) {
        return Qe(), Me;
    }
    e = false;
    if (a < 0) {
        e = true;
        a = -a;
    }
    d = 0;
    if (a >= 17592186044416) {
        d = Bc(a / 17592186044416);
        a -= d * 17592186044416;
    }
    c = 0;
    if (a >= 4194304) {
        c = Bc(a / 4194304);
        a -= c * 4194304;
    }
    b = Bc(a);
    f = de(b, c, d);
    e && je(f);
    return f;
}
