//// [node_modules/@types/node/index.d.ts]
//// [index.js]
/// <reference types="node" />
var A;
export var Something = 2; // to show conflict that can occur
var A1;
// @ts-ignore
export { A1 as A };
(A = A1 || (A1 = {})).B || (A.B = {}), new (require("fs")).Something();
