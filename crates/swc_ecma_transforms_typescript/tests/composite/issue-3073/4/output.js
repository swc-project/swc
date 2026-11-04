(function(A) {
    const a = 1;
    const b = 2;
    ({ a: A.A } = {
        a
    });
    ({ b: A.B } = {
        b
    });
})(A || (A = {}));
(function(A) {
    const c = 3;
    const d = 4;
    ({ c: A.C } = {
        c: c
    });
    ({ d: A.D } = {
        d: d
    });
})(A || (A = {}));
var A;
