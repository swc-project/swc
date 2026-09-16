a.b;
x().y;
a.b.c;
// The object is evaluated before the computed key.
x()[y()];
({ p: 1 }).p;
