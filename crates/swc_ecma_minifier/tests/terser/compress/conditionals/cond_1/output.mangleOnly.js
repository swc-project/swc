function e(e, f) {
    if (f) {
        e(x);
    } else {
        e(y);
    }
    if (f) {
        side_effects(x);
    } else {
        side_effects(y);
    }
}
