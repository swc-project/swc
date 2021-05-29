class Foo {
    bar = "bar";
    static zzz = "zzz";
    toString() {
        return this.bar + Foo.zzz;
    }
}

console.log(new Foo().toString())