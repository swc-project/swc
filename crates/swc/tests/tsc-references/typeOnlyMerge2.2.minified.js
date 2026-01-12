//// [a.ts]
var A = {};
export { A };
//// [b.ts]
import "./a";
//// [c.ts]
var A;
A || (A = {});
export { A };
//// [d.ts]
import "./c";
