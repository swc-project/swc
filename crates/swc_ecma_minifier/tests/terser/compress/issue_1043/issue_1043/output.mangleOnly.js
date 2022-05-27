function* a(a = 0, b = null, d = 1) {
    if (b == null) {
        b = a;
        a = 0;
    }
    for(let c = a; c < b; c += d){
        yield c;
    }
}
