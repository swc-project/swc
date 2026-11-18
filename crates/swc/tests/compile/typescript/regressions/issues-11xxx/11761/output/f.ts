var E = function(E) {
    E[E["Infinity"] = foo()] = "Infinity";
    E[E["B"] = E.Infinity] = "B";
    return E;
}(E || {});
