//// [enum.ts]
export var Enum;
!function(Enum) {
    Enum[Enum.One = 1] = "One";
}(Enum || (Enum = {}));
//// [merge.ts]
import "./enum";
//// [index.ts]
import { Enum } from "./merge";
Enum.One;
