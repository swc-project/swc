function f1(a, b) {
    var c;
    if (a) return (c = b) || a;
    else (c = a)(b);
}
function f2(a, b) {
    var c;
    while (a) a = (c = b) + b;
    do {
        throw (c = a + b);
    } while (c);
}
function f3(a, b) {
    for (; a < b; a++) if ((c = a) && b) var c = (c = b(a));
}
