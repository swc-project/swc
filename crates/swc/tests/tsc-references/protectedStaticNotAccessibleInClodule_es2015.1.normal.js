// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
class C {
}
(function(C1) {
    C1.f = C.foo;
    C1.b = C.bar;
})(C || (C = {
}));
