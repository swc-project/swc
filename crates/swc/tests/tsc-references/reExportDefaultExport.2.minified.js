//// [reExportDefaultExport.ts]
"use strict";
//// [m1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get default () {
        return f;
    },
    get f () {
        return f;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
function f() {}
//// [m2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./m1"));
(0, _m1.f)(), (0, _m1.default)();
