function f1(a) {
    null == a;
    void 0 === a || null !== a;
    void 0 !== a || null === a;
    void 0 !== a || null !== a;
    void 0 === a && null === a;
    void 0 === a && null !== a;
    void 0 !== a && null === a;
    null != a;
}
function f2(a) {
    null == a;
    null === a || void 0 !== a;
    null !== a || void 0 === a;
    null !== a || void 0 !== a;
    null === a && void 0 === a;
    null === a && void 0 !== a;
    null !== a && void 0 === a;
    null != a;
}
