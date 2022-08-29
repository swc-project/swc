//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C1", {
    enumerable: !0,
    get: function() {
        return C1;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1), this.m1 = 42;
};
C1.s1 = !0;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("./foo_0").C1.s1;
