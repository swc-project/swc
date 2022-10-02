class Foo {
    z = "bar";
    static r = "zzz";
    toString() {
        return this.z + Foo.r;
    }
}
