function e(f, e) {
    if (e) {
        f(x);
    } else {
        f(y);
    }
    if (e) {
        side_effects(x);
    } else {
        side_effects(y);
    }
}
