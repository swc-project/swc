class A {
}
class B extends A {
}
function NewA(Factory) {
    return new A;
}
function NewB(Factory) {
    return new B;
}
NewA(A), NewA(B), NewB(A), NewB(B);
