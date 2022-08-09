function r(r) {
    try {
        var t = x();
        ++r;
        return r(t);
    } catch (c) {}
    console.log(r);
}
r(0);
