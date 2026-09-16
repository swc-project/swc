// `strict` only relaxes nullish checks in terser, not getter effects,
// so property reads must be preserved.
a.b;
x().y;
