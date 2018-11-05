var a , b ;
if (a && !(a + "1") && b) {
    var // 1
    var c ;
    // 1
    var c;
    d();
} else {
    // 1
    var c;
    d();
} else {
    e();
}
if (// 1
    var c;
    d();
} else {
    e();
}

if (a || !!(// 1
    var c;
    d();
} else {
    e();
}

if (a || !!(a + "1") || // 1
    var c;
    d();
} else {
    e();
}

if (a || !!(a + "1") || b) {
    // 2
    d();
} else {
    var // 2
    d();
} else {
    var f ;
    // 2
    d();
} else {
    var f;
    e();
}
