class Foo {
    [(console.log(1), 1)] = 1;
    [Symbol.iterator] = 2;
    static {
        console.log("Foo");
    }
    [(console.log(2), 2)] = 1;
}
