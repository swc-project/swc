function a() {
    try {
        a();
    } catch (b) {
        var c = 1;
    }
    return c;
}
