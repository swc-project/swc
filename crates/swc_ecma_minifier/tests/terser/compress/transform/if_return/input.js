function f(w, x, y, z) {
    if (x) return;
    if (w) {
        if (y) return;
    } else if (z) return;
    if (x == y) return true;
    if (x) w();
    if (y) z();
    return true;
}
