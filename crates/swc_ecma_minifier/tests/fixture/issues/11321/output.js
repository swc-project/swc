// Test case 1: Multiple default imports with different local names (the reported bug)
import A, { default as B } from "m.js";
// Test case 2: Multiple namespace imports with different local names
import * as X from "p.js";
import * as Y from "p.js";
// Test case 3: Mix of multiple defaults and named imports
import C, { default as D, foo, bar } from "r.js";
// Test case 4: Mix of all kinds of imports
import E, * as ns1 from "q.js";
import F, { default as G, a, b, c } from "q.js";
import H, * as ns2 from "q.js";
// Use all imports to prevent dead code elimination
console.log(A, B, C, D, E, F, G, H), console.log(X, Y), console.log(foo, bar), console.log(ns1, ns2), console.log(a, b, c);
