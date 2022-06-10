console.log((function(a) {
    do {
        var b = {
            c: a++
        };
    }while (b.c && a)
    return a;
})(0));
