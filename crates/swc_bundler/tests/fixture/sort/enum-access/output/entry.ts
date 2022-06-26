var A;
(function(A) {
    A[A["b"] = 5] = "b";
    A[A["c"] = 28] = "c";
})(A || (A = {}));
function foo() {
    console.log(A);
}
function lazy() {
    foo();
}
lazy();
