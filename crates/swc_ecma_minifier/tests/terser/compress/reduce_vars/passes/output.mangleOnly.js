function l() {
    var l = 1, o = 2, g = 3;
    if (l) {
        o = g;
    } else {
        g = o;
    }
    console.log(l + o);
    console.log(o + g);
    console.log(l + g);
    console.log(l + o + g);
}
