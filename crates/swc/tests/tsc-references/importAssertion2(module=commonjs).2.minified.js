//// [importAssertion2.ts]
"use strict";
//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    a: function() {
        return a;
    },
    b: function() {
        return b;
    }
});
const a = 1, b = 2;
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    a: function() {
        return _0.a;
    },
    b: function() {
        return _0.b;
    },
    ns: function() {
        return _0;
    }
});
const _export_star = require("@swc/helpers/_/_export_star"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard"), _0 = _interop_require_wildcard._(_export_star._(require("./0"), exports));
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    a: function() {
        return _0.a;
    },
    b: function() {
        return _0.b;
    },
    c: function() {
        return _0.a;
    },
    d: function() {
        return _0.b;
    }
});
const _0 = require("./0");
