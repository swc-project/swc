var A;
(function(A1) {
    A1[A1["b"] = 5] = "b";
    A1[A1["c"] = 28] = "c";
})(A || (A = {
}));
const A1 = A;
const A2 = A1;
function foo() {
    console.log(A2);
}
const foo1 = foo;
const foo2 = foo1;
function lazy() {
    foo2();
}
lazy();
