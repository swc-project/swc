// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
export { };
// @Filename: b.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
export { };
// @Filename: c.ts
export { };
// @Filename: c.fixed.ts
export { };
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
// @Filename: d.fixed.ts
export { };
// @Filename: e.ts
export { };
// @Filename: e.fixed.ts
export { };
// @Filename: f.ts
export { };
// @Filename: f.fixed.ts
export { };
