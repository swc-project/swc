var a = 0, b = 0;
class c {
    get c() {
        a++;
        return 42;
    }
    set c(a) {
        b++;
    }
}
class d extends c {
    d() {
        super.c++;
        if (super.c) console.log(a, b);
    }
}
new d().d();
