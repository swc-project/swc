function a(a, b) {
    if (b) {
        a(x);
    } else {
        a(y);
    }
    if (b) {
        side_effects(x);
    } else {
        side_effects(y);
    }
}
