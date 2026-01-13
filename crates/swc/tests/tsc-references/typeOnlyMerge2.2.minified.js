//// [a.ts]
var A = {};
export { A };
//// [b.ts]
import "./a";
//// [c.ts]
export { };
//// [d.ts]
import "./c";
