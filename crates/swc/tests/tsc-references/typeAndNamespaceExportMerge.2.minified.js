//// [typeAndNamespaceExportMerge.ts]
//// [constants.ts]
export var COFFEE = 0;
export var TEA = 1;
//// [drink.ts]
import * as _Drink from "./constants";
export { _Drink as Drink };
//// [index.ts]
import { Drink } from "./drink";
Drink.TEA;
