// Test case 1: Multiple default imports with different local names (the reported bug)
import A from "m.js";
import B from "m.js";

// Test case 2: Multiple namespace imports with different local names
import * as X from "p.js";
import * as Y from "p.js";

// Test case 3: Mix of multiple defaults and named imports
import C from "r.js";
import D from "r.js";
import { foo } from "r.js";
import { bar } from "r.js";

// Test case 4: Mix of all kinds of imports
import * as ns1 from "q.js";
import { default as E, "default" as F } from "q.js";
import G from "q.js";
import { a, b, c } from "q.js";
import * as ns2 from "q.js";
import H from "q.js";

// Use all imports to prevent dead code elimination
console.log(A, B, C, D, E, F, G, H);
console.log(X, Y);
console.log(foo, bar);
console.log(ns1, ns2);
console.log(a, b, c);
