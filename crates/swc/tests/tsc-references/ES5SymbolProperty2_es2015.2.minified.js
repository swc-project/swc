var M;
!function(M1) {
    var Symbol, tmp = Symbol.iterator;
    class C {
        [tmp]() {}
    }
    M1.C = C, (new C)[Symbol.iterator];
}(M || (M = {})), (new M.C)[Symbol.iterator];
