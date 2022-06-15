function* a(a = 0, b = null, c = 1) {
    if (b == null) {
        b = a;
        a = 0;
    }
    for(let d = a; d < b; d += c){
        yield d;
    }
}
