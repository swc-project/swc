// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import { A } from "./a";
// @Filename: e.ts
import { BB } from "./d";
// @Filename: b.ts
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
export { B as BB };
