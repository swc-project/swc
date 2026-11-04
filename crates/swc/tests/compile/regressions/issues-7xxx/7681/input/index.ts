enum Foo {
    a,
    b = 1,
    c = Foo["a"],
    d = Foo.a,
    e,
    f,
}
