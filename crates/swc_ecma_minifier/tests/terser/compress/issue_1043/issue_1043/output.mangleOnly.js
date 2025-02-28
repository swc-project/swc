function* l(f = 0, n = null, i = 1) {
    if (n == null) {
        n = f;
        f = 0;
    }
    for(let l = f; l < n; l += i){
        yield l;
    }
}
