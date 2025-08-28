//// [noInferRedeclaration.ts]
//// [a.ts]
export let f = (x, y)=>x;
//// [b.ts]
import { f } from "./a";
export let g = f;
