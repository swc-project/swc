var c = 0, d = 0;
class a {
    get c() {
        c++;
        return 42;
    }
    set c(a) {
        d++;
    }
}
class b extends a {
    d() {
        super.c++;
        if (super.c) console.log(c, d);
    }
}
new b().d();
