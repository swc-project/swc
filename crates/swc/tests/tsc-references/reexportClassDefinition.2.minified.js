//// [foo1.ts]
"use strict";
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
module.exports = function x() {
    "use strict";
    _class_call_check(this, x);
};
//// [foo2.ts]
"use strict";
var foo1 = require("./foo1");
module.exports = {
    x: foo1
};
//// [foo3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/lib/_class_call_check.js").default, require("@swc/helpers/lib/_inherits.js").default, require("@swc/helpers/lib/_create_super.js").default, require("./foo2").x;
