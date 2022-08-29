//// [exportStar.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
var x = 1, y = 2;
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    default: function() {
        return _default;
    },
    foo: function() {
        return foo;
    }
});
var _default = "hello";
function foo() {}
//// [t3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    },
    z: function() {
        return z;
    }
});
var x = "x", y = "y", z = "z";
//// [t4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _exportStar = require("@swc/helpers/lib/_export_star.js").default;
_exportStar(require("./t1"), exports), _exportStar(require("./t2"), exports), _exportStar(require("./t3"), exports);
//// [main.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _t4 = (0, require("@swc/helpers/lib/_interop_require_wildcard.js").default)(require("./t4"));
_t4.default, _t4.x, _t4.y, _t4.z, _t4.foo;
