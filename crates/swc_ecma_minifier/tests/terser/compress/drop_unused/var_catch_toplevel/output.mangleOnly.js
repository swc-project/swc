function a() {
    c--;
    try {
        c++;
        x();
    } catch (c) {
        if (a) var a;
        var c = 10;
    }
}
a();
