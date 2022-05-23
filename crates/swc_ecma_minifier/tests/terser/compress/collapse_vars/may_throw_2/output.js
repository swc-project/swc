function f(b) {
    try {
        var a = x();
        return (++b)(a);
    } catch (e) {}
    console.log(b);
}
f(0);
