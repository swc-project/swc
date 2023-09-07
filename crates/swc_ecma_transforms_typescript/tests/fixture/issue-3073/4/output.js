var A;
(function(A) {
    const a = 1;
    const b = 2;
    const { a: A1 } = { a: A.A } = {
        a
    };
    const { b: B } = { b: A.B } = {
        b
    };
})(A || (A = {}));
(function(A) {
    const c = 3;
    const d = 4;
    const { c: C } = { c: A.C } = {
        c: c
    };
    const { d: D } = { d: A.D } = {
        d: d
    };
})(A || (A = {}));
