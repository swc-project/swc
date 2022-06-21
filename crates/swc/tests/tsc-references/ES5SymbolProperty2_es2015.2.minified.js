var M;
!function(M) {
    var Symbol1;
    class C {
        [Symbol1.iterator]() {}
    }
    M.C = C, (new C)[Symbol1.iterator];
}(M || (M = {})), (new M.C)[Symbol.iterator];
