export var E = function (E) {
    E[E["A"] = 1] = "A";
    return E;
}(E || {});

E = function (E) {
    E[E["B"] = 2] = "B";
    return E;
}(E);

var E1 = function (E1) {
    E1[E1["C"] = 3] = "C";
    return E1;
}(E1 || {});

E1 = function (E1) {
    E1[E1["D"] = 4] = "D";
    return E1;
}(E1);

export var N = (function (N) {
    let E = function (E) {
        E[E["A"] = 1] = "A";
        return E;
    }(N.E || (N.E = {}));

    E = function (E) {
        E[E["B"] = 2] = "B";
        return E;
    }(N.E);

    let E1 = function (E1) {
        E1[E1["C"] = 3] = "C";
        return E1;
    }({});

    E1 = function (E1) {
        E1[E1["D"] = 4] = "D";
        return E1;
    }(E1);
})(N || (N = {}));

N = (function (N) {
    let E = function (E) {
        E[E["c"] = 3] = "c";
        return E;
    }(N.E || (N.E = {}));
    E = function (E) {
        E[E["d"] = 4] = "d";
        return E;
    }(N.E);
    var N1 = ((function (N1) {
        let E2 = function (E2) {
            E2[E2["e"] = 5] = "e";
            return E2;
        }(N1.E2 || (N1.E2 = {}));
    })(N1), N1);
    N1 = (function (N1) {
        let E2 = function (E2) {
            E2[E2["f"] = 6] = "f";
            return E2;
        }(N1.E2 || (N1.E2 = {}));
    })(N1), N1;
    var N2 = ((function (N2) {
        let E3 = function (E3) {
            E3[E3["g"] = 7] = "g";
            return E3;
        }({});
    })(N2), N2);
})(N);

var N1 = (function (N1) {
    let E2 = function (E2) {
        E2[E2["e"] = 5] = "e";
        return E2;
    }(N1.E2 || (N1.E2 = {}));
})(N1 || (N1 = {}));

N1 = (function (N1) {
    let E2 = function (E2) {
        E2[E2["f"] = 6] = "f";
        return E2;
    }(N1.E2 || (N1.E2 = {}));
})(N1);
