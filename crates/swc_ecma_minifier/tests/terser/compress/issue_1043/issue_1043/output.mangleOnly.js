function* l(n = 0, f = null, i = 1) {
    if (f == null) {
        f = n;
        n = 0;
    }
    for(let l = n; l < f; l += i){
        yield l;
    }
}
