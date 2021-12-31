// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
class C {
}
class D extends C {
}
(function(D1) {
    var y = D1.y = D.bar;
})(D || (D = {
}));
