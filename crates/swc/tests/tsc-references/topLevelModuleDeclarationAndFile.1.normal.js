//// [vs/foo_0/index.ts]
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
var x = 42;
//// [foo_1.ts]
"use strict";
//// [foo_2.ts]
/// <reference path="foo_1.ts"/>
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("vs/foo_0");
var z1 = foo.x + 10; // Should error, as declaration should win
var z2 = foo.y() + 10; // Should resolve
