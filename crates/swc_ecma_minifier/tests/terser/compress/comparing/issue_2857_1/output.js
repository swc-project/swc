function f1(a) {
    void 0 === a || null !== a;
    void 0 !== a || null === a;
    void 0 !== a || null !== a;
    void 0 === a && null === a;
    void 0 === a && null !== a;
    void 0 !== a && null === a;
}
function f2(a) {
    null === a || void 0 !== a;
    null !== a || void 0 === a;
    null !== a || void 0 !== a;
    null === a && void 0 === a;
    null === a && void 0 !== a;
    null !== a && void 0 === a;
}
