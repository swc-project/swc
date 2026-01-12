//// [preserveValueImports.ts]
//// [a.ts]
export default {};
export var b = 0;
export var c = 1;
//// [b.ts]
export { };
//// [c.ts]
export { };
//// [d.ts]
export { };
//// [e.ts]
DD;
export { };
//// [f.ts]
import "./a";
