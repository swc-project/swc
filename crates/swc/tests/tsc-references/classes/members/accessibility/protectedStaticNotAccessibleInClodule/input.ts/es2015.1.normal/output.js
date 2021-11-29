// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
class C {
}
(function(C) {
    C.f = C.foo;
    C.b = C.bar;
})(C || (C = {
}));
