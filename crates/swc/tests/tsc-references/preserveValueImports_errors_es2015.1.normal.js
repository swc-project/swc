// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
// @Filename: b.ts
class B {
}
import { A } from "./a";
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
// @Filename: e.ts
import { BB } from "./d";
export { B as BB };
