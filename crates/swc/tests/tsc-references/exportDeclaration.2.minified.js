//// [exportDeclaration.ts]
"use strict";
//// [/a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/_/_class_call_check");
//// [/b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), new (require("./a")).A();
//// [/c.ts]
"use strict";
module.exports = A;
//// [/d.ts]
"use strict";
var _a = require("./a");
module.exports = _a.A;
