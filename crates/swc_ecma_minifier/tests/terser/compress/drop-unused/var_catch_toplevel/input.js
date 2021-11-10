function f() {
    a--;
    try {
        a++;
        x();
    } catch (a) {
        if (a) var a;
        var a = 10;
    }
}
f();
