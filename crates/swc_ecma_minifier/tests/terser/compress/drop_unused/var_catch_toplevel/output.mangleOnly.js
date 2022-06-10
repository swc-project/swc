function a() {
    a--;
    try {
        a++;
        x();
    } catch (a) {
        if (b) var b;
        var a = 10;
    }
}
a();
