//// [bundlerSyntaxRestrictions.ts]
//// [/node_modules/@types/node/index.d.ts]
//// [/ambient.d.ts]
//// [/mainJs.js]
import "./a";
import("./a"), require("./a").a;
//// [/main.ts]
import "./a";
//// [/a.ts]
export var a = "a";
