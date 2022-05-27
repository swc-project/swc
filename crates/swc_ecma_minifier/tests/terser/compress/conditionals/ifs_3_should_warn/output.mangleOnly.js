var a, b;
if (a && !(a + "1") && b) {
    var c;
    foo();
} else {
    bar();
}
if (a || !!(a + "1") || b) {
    foo();
} else {
    var d;
    bar();
}
