//// [enum.ts]
var Enum;
var Enum1;
export { Enum1 as Enum };
(Enum = Enum1 || (Enum1 = {}))[Enum.One = 1] = "One";
//// [merge.ts]
import "./enum";
//// [index.ts]
import { Enum } from "./merge";
Enum.One;
