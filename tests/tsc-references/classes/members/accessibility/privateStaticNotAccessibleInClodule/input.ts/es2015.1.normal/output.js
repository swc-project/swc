// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
class C1 {
}
(function(C) {
    C.y = C1.bar;
})(C1 || (C1 = {
}));
