function f(b) {
    try {
        var a = x();
        ++b;
        return b(a);
    } catch (e) {}
    console.log(b);
}
f(0);
