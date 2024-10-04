var A = /*#__PURE__*/ function(A) {
    A[A["b"] = 5] = "b";
    A[A["c"] = 28] = "c";
    return A;
}({});
function foo() {
    console.log(A);
}
function lazy() {
    foo();
}
lazy();
