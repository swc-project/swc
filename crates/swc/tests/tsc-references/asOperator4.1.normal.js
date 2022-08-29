//// [foo.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: function() {
        return foo;
    }
});
function foo() {}
//// [bar.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _foo = require("./foo");
// These should emit identically
_foo.foo;
_foo.foo;
