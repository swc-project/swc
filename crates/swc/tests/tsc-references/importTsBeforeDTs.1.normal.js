//// [foo_0.d.ts]
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
//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "y", {
    enumerable: true,
    get: function() {
        return y;
    }
});
var y = 42;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("./foo_0");
var z1 = foo.x + 10; // Should error, as .ts preferred over .d.ts
var z2 = foo.y + 10; // Should resolve
