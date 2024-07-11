export let A;
(function(A) {
    class B extends A {
    }
    A.B = B;
})(A || (A = {}));
(function(A) {})(A || (A = {}));
