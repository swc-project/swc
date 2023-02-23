//// [leaveOptionalParameterAsWritten.ts]
//// [a.ts]
export { };
//// [b.ts]
import "./a";
//// [c.ts]
export var bar = function(p) {};
