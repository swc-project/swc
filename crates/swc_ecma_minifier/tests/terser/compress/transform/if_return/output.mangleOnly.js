function a(a, b, c, d) {
    if (b) return;
    if (a) {
        if (c) return;
    } else if (d) return;
    if (b == c) return true;
    if (b) a();
    if (c) d();
    return true;
}
