// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
class C {
}
(function(C1) {
    var y = C1.y = C.bar;
})(C || (C = {}));
