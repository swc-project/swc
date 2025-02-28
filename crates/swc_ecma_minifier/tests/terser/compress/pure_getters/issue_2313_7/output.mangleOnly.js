var c = 0, r = 0;
class e {
    get c() {
        c++;
        return 42;
    }
    set c(e) {
        r++;
    }
}
class s extends e {
    d() {
        super.c++;
        if (super.c) console.log(c, r);
    }
}
new s().d();
