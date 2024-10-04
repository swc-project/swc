//// [foo_0.ts]
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
var foo = 42;
//// [test/test/foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "f", {
    enumerable: true,
    get: function() {
        return f;
    }
});
function f() {
    return 42;
}
//// [test/foo_2.ts]
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
(function(M2) {
    M2.x = true;
})(M2 || (M2 = {}));
var M2;
//// [test/foo_3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo0 = require("../foo_0");
var foo1 = require("./test/foo_1");
var foo2 = require("./.././test/foo_2");
if (foo2.M2.x) {
    var x = foo0.foo + foo1.f();
}
