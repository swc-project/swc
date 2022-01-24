class C {
}
!function(C1) {
    C1.f = C.foo, C1.b = C.bar;
}(C || (C = {}));
