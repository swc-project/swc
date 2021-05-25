class Foo {
    bar = "bar";
    static zzz = "zzz";
    toString() {
        return this.bar + Foo.zzz;
    }
}
