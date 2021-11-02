// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
class C {
}
class D1 extends C {
}
(function(D) {
    D.y = D1.bar;
})(D1 || (D1 = {
}));
