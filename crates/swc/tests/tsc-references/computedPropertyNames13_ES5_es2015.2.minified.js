var s, n, a;
class C {
    [s]() {}
    [n]() {}
    static [s + s]() {}
    [s + n]() {}
    [+s]() {}
    static ""() {}
    0() {}
    [a]() {}
    static [!0]() {}
    "hello bye"() {}
    static [`hello ${a} bye`]() {}
}
