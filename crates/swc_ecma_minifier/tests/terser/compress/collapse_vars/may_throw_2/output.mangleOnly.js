function c(c) {
    try {
        var n = x();
        ++c;
        return c(n);
    } catch (o) {}
    console.log(c);
}
c(0);
