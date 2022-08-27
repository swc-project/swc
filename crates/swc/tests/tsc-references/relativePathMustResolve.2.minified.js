//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "x", {
    enumerable: !0,
    get: function() {
        return x;
    }
});
var x = 42;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("./test/foo").x;
