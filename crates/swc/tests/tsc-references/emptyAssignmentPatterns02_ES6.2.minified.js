//// [emptyAssignmentPatterns02_ES6.ts]
let x, y, z, a1, a2, a3;
({} = { x, y, z } = void 0), [] = [a1, a2, a3] = void 0;
