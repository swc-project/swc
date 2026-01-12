//// [enum.ts]
export { };
//// [merge.ts]
(function(Enum) {})(Enum || (Enum = {}));
export { Enum };
var Enum;
//// [index.ts]
import { Enum } from "./merge";
Enum.One;
