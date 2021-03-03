var A;
(function(A1) {
    A1[A1["b"] = 5] = "b";
    A1[A1["c"] = 28] = "c";
})(A || (A = {
}));
function foo() {
    console.log(A);
}
function lazy() {
    foo();
}
lazy();
