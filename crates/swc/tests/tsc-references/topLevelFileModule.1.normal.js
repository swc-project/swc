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
//// [vs/fum.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("./vs/foo_0");
var fum = require("./vs/fum");
var z = foo.x + fum.y;
