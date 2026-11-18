const A = 100;
var E = function(E) {
    E[E["A"] = foo()] = "A";
    E[E["B"] = E.A] = "B";
    return E;
}(E || {});
