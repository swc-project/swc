function r(e, r, f, i) {
    if (r) return;
    if (e) {
        if (f) return;
    } else if (i) return;
    if (r == f) return true;
    if (r) e();
    if (f) i();
    return true;
}
