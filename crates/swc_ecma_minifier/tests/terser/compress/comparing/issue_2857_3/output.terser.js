function f(a, p) {
    void 0 === a || (null === a && p);
    void 0 === a || (null !== a && p);
    void 0 !== a || (null === a && p);
    void 0 !== a || (null !== a && p);
    void 0 === a && null === a && p;
    void 0 === a && null !== a && p;
    void 0 !== a && null === a && p;
    null != a && p;
}
