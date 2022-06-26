function a() {
    try {
        a();
    } catch (b) {
        var c = 10;
    }
    return c;
}
