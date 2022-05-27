function a(a) {
    try {
        var b = x();
        ++a;
        return a(b);
    } catch (c) {}
    console.log(a);
}
a(0);
