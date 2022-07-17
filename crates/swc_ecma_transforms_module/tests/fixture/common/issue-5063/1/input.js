class Foo {
    bar = 5;
    getThing(a, b = this.bar) {
        return a + b;
    }
}
