const enum E {
    a = 10,
    b = a,
    c = (a + 1),
    e,
    d = ~e,
    f = ~d,
}