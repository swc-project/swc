//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "M2", {
    enumerable: true,
    get: function() {
        return M2;
    }
});
(function(M2) {})(M2 || (M2 = {}));
var M2;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo0 = require("./foo_0");
// Per 11.2.3, foo_0 should still be "instantiated", albeit with no members
var x = {};
var y = foo0;
