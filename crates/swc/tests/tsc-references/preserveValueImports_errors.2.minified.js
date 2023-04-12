//// [preserveValueImports_errors.ts]
//// [a.ts]
export { };
//// [b.ts]
import "@swc/helpers/_/_class_call_check";
//// [c.ts]
export { };
//// [c.fixed.ts]
export { };
//// [d.ts]
export { A as AA } from "./a";
export { B as BB } from "./b";
//// [d.fixed.ts]
export { };
//// [e.ts]
export { };
//// [e.fixed.ts]
export { };
//// [f.ts]
export { };
//// [f.fixed.ts]
export { };
