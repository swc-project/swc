//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C1", {
    enumerable: true,
    get: function() {
        return C1;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
    this.m1 = 42;
};
C1.s1 = true;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("./foo_0");
if (foo.C1.s1) {
// Should cause runtime import
}
