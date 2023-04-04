//// [exportAndImport-es3.ts]
"use strict";
//// [m1.ts]
"use strict";
function f1() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return f1;
    }
});
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return f2;
    }
});
var _m1 = require("@swc/helpers/_/_interop_require_default")._(require("./m1"));
function f2() {
    (0, _m1.default)();
}
