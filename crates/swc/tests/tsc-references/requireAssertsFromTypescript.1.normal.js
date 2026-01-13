//// [ex.d.ts]
// based on assert in @types/node
//// [ex2.d.ts]
export { };
//// [38379.js]
var art = require('./ex').art;
var artoo = require('./ex2');
var x = 1;
art(x);
var y = 1;
artoo(y);
