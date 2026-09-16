// A plain property read is dropped, the object is kept for its effects.
a;
x();
// Nested reads collapse to the innermost effectful expression.
a;
// A computed key is still evaluated, after the object.
x(), y();
