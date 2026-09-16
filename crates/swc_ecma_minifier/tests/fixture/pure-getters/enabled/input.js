// A plain property read is dropped, the object is kept for its effects.
a.b;
x().y;
// Nested reads collapse to the innermost effectful expression.
a.b.c;
// A computed key is still evaluated, after the object.
x()[y()];
// An effect-free object disappears entirely.
({ p: 1 }).p;
