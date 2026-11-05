var x = 4;
enum Foo {
    a,
    b = a,
    c = b + 1,
    d = 1 + c * x,
    e = 2 * d,
    f = Foo.e * 10,
}
