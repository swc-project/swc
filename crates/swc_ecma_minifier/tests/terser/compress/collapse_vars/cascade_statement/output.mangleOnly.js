function a(b, c) {
    var a;
    if (b) return (a = c), a || b;
    else (a = b), a(c);
}
function b(b, c) {
    var a;
    while(b)(a = c), (b = a + c);
    do {
        throw ((a = b + c), a);
    }while (a)
}
function c(a, b) {
    for(; a < b; a++)if (((c = a), c && b)) var c = ((c = b(a)), c);
}
