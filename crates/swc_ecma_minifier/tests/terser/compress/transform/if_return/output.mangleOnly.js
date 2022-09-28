function r(r, e, f, i) {
    if (e) return;
    if (r) {
        if (f) return;
    } else if (i) return;
    if (e == f) return true;
    if (e) r();
    if (f) i();
    return true;
}
