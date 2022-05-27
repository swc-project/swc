function a() {
    try {
        a();
    } catch (c) {
        var b = 10;
    }
    return b;
}
