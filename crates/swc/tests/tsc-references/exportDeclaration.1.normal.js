//// [exportDeclaration.ts]
"use strict";
//// [/a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var A = function A() {
    "use strict";
    _class_call_check._(this, A);
};
//// [/b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _a = require("./a");
new _a.A();
//// [/c.ts]
"use strict";
module.exports = A;
//// [/d.ts]
"use strict";
var _a = require("./a");
module.exports = _a.A;
