//// [logicalAssignment11.ts]
let x;
(x ?? "x").length;
let e;
(e ??= x ?? "x").length;
