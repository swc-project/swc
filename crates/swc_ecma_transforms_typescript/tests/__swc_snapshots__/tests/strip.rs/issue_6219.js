var A = function(A) {
    A[A["a"] = A.a] = "a";
    return A;
}(A || {});
