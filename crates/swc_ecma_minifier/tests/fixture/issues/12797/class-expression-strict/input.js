"use strict";

// Unused class expressions use the same extraction as class declarations.

// This code is strict, so a function in the heritage expression keeps its
// meaning and the class can be dropped.
(class extends f(function () {}) {});

// This code is strict, so a property write keeps its meaning and the class
// can be dropped.
(class {
    static x = (o.p = 1);
});

// A computed key that refers to the class is kept with the class.
(class C {
    [g(() => C)]() {}
});

// Plain side effects are extracted.
(class {
    [h()]() {}
    static y = i();
});
