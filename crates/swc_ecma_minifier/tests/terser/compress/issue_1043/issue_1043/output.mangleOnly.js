function* l(l = 0, n = null, f = 1) {
    if (n == null) {
        n = l;
        l = 0;
    }
    for(let i = l; i < n; i += f){
        yield i;
    }
}
