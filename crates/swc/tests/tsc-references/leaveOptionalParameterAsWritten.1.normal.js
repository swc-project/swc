//// [leaveOptionalParameterAsWritten.ts]
//// [a.ts]
export { };
//// [b.ts]
import * as a from "./a";
//// [c.ts]
export var bar = function bar(p) {};
