// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: b.ts
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
import { A } from "./a";
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
// @Filename: e.ts
import { BB } from "./d";
export { B as BB };
