var X = 4;
enum Foo {
    A,
    B = A,
    C = A + 2,
    D = C * X,
    E = C + 4,
    F = Math.E * 2,
}
