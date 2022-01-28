function f(w, x, y, z) {
    if (!x) {
        if (w) {
            if (y) return;
        } else if (z) return;
        return x == y || (x && w(), y && z()), !0;
    }
}
