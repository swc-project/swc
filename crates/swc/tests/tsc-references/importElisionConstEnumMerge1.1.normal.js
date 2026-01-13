//// [enum.ts]
export var Enum = /*#__PURE__*/ function(Enum) {
    Enum[Enum["One"] = 1] = "One";
    return Enum;
}({});
//// [merge.ts]
export { };
//// [index.ts]
import { Enum } from "./merge";
Enum.One;
