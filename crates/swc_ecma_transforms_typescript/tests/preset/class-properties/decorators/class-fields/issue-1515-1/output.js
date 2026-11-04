export class A {
}
(function(A) {
    class B extends A {
    }
    A.B = B;
})(A || (A = {}));
