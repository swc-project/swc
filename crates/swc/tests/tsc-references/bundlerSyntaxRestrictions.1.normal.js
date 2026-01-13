//// [bundlerSyntaxRestrictions.ts]
//// [/node_modules/@types/node/index.d.ts]
//// [/ambient.d.ts]
//// [/mainJs.js]
import "./a";
import("./a");
var _ = require("./a");
_.a; // any
//// [/main.ts]
import "./a";
//// [/a.ts]
export var a = "a";
