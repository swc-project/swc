var A1;
(function(A) {
    A[A["b"] = 5] = "b";
    A[A["c"] = 28] = "c";
})(A1 || (A1 = {
}));
function foo() {
    console.log(A1);
}
function lazy() {
    foo();
}
lazy();
