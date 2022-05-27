function a(c, a, b, d) {
    if (a) return;
    if (c) {
        if (b) return;
    } else if (d) return;
    if (a == b) return true;
    if (a) c();
    if (b) d();
    return true;
}
