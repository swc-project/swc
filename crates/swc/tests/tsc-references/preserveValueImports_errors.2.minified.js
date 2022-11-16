//// [preserveValueImports_errors.ts]
//// [a.ts]
export { };
//// [b.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
