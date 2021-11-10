function f() {
    var t;
    try {
        x();
    } catch (t) {
        y();
    }
    alert(t);
}
