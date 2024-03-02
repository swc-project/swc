//// [noInferRedeclaration.ts]
//// [a.ts]
export const f = (x, y)=>x;
//// [b.ts]
import { f } from "./a";
export const g = f;
