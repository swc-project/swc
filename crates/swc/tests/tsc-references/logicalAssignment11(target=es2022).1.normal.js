//// [logicalAssignment11.ts]
let x;
let d;
d ?? (d = x ?? "x");
d.length;
let e;
e ??= x ?? "x";
e.length;
