var a, b;
if (a && !(a + "1") && b) { // 1
    var c;
    d();
} else {
    e();
}

if (a || !!(a + "1") || b) { // 2
    d();
} else {
    var f;
    e();
}