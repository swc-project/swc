var x = 10;

enum Foo {
    a = 10,
    b = a,
    c = b + x,
    d = c,
}

enum Bar {
    a = 1,
    b = Foo.a,
    E = b,
    F = Math.E,
}

enum Baz {
    a = 0,
    b = 1,
    // @ts-ignore
    x = a.toString(),
}
