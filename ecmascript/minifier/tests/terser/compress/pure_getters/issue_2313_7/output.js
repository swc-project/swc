var a = 0,
    b = 0;
class foo {
    get c() {
        a++;
        return 42;
    }
    set c(c) {
        b++;
    }
}
class bar extends foo {
    d() {
        super.c++;
        super.c && console.log(a, b);
    }
}
new bar().d();
