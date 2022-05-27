class C {
    [Symbol.iterator]() {}
}
(new C)[Symbol.iterator];
