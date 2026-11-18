// Unused class expressions use the same extraction as class declarations.
// A function in the heritage expression is strict only in the class, and
// this code is sloppy, so the class is kept.
(class extends f(function() {}) {
}), // A property write behaves differently in sloppy code, so the class is kept.
(class {
    static x = o.p = 1;
}), // A computed key that refers to the class is kept with the class.
(class C {
    [g(()=>C)]() {}
}), h(), i();
