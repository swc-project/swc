function i(i, n) {
    var r;
    if (i) return (r = n), r || i;
    else (r = i), r(n);
}
function n(i, n) {
    var r;
    while(i)(r = n), (i = r + n);
    do {
        throw ((r = i + n), r);
    }while (r)
}
function r(i, n) {
    for(; i < n; i++)if (((r = i), r && n)) var r = ((r = n(i)), r);
}
