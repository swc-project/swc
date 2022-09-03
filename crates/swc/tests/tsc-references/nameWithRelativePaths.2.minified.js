//// [foo_0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "foo", {
    enumerable: !0,
    get: function() {
        return foo;
    }
});
var foo = 42;
//// [test/test/foo_1.ts]
"use strict";
function f() {
    return 42;
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "f", {
    enumerable: !0,
    get: function() {
        return f;
    }
});
//// [test/foo_2.ts]
"use strict";
var M2;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "M2", {
    enumerable: !0,
    get: function() {
        return M2;
    }
}), (M2 || (M2 = {})).x = !0;
//// [test/foo_3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo0 = require("../foo_0"), foo1 = require("./test/foo_1"), foo2 = require("./.././test/foo_2");
if (foo2.M2.x) var x = foo0.foo + foo1.f();
