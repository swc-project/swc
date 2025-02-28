function i(n, r) {
    var i;
    if (n) return (i = r), i || n;
    else (i = n), i(r);
}
function n(n, r) {
    var i;
    while(n)(i = r), (n = i + r);
    do {
        throw ((i = n + r), i);
    }while (i)
}
function r(i, n) {
    for(; i < n; i++)if (((r = i), r && n)) var r = ((r = n(i)), r);
}
