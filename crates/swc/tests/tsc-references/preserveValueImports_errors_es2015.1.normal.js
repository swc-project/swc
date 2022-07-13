// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
import { A } from "./a";
// @Filename: e.ts
import { BB } from "./d";
// @Filename: b.ts
class B {
}
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
export { B as BB };
