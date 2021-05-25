class Foo {
    t = "bar";
    static o = "zzz";
    toString() {
        return this.t + Foo.o;
    }
}
