//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo0 = require("./foo_0");
// Per 11.2.3, foo_0 should still be "instantiated", albeit with no members
var x = {};
var y = foo0;
