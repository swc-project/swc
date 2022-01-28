function f1(a, b) {
    var c;
    if (a) return (c = b), c || a;
    else (c = a), c(b);
}
function f2(a, b) {
    var c;
    while (a) (c = b), (a = c + b);
    do {
        throw ((c = a + b), c);
    } while (c);
}
function f3(a, b) {
    for (; a < b; a++) if (((c = a), c && b)) var c = ((c = b(a)), c);
}
