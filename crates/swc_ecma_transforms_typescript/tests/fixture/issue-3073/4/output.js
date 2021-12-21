var A;
(function(A1) {
    const a = 1;
    const b = 2;
    ({ a: A1.A  } = {
        a
    });
    ({ b: A1.B  } = {
        b
    });
})(A || (A = {
}));
(function(A2) {
    const c = 3;
    const d = 4;
    ({ c: A2.C  } = {
        c: c
    });
    ({ d: A2.D  } = {
        d: d
    });
})(A || (A = {
}));
