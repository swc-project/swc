//// [vs/foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "x", {
    enumerable: true,
    get: function() {
        return x;
    }
});
var x;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("vs/foo");
var z = foo.x + 10;
