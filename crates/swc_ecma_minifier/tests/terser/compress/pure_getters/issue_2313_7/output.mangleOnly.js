var e = 0, s = 0;
class c {
    get c() {
        e++;
        return 42;
    }
    set c(e) {
        s++;
    }
}
class r extends c {
    d() {
        super.c++;
        if (super.c) console.log(e, s);
    }
}
new r().d();
