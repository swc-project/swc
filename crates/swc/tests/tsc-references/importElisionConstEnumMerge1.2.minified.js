//// [enum.ts]
var Enum;
var Enum1 = ((Enum = {})[Enum.One = 1] = "One", Enum);
export { Enum1 as Enum,  };
//// [merge.ts]
import "./enum";
//// [index.ts]
import { Enum } from "./merge";
Enum.One;
