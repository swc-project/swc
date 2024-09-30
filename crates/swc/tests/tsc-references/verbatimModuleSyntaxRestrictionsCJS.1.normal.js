//// [verbatimModuleSyntaxRestrictionsCJS.ts]
"use strict";
//// [/decl.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = esmy;
//// [/ambient.d.ts]
"use strict";
//// [/main.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Values: function() {
        return Values;
    },
    x: function() {
        return x;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _decl = /*#__PURE__*/ _interop_require_wildcard._(require("./decl"));
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./decl"))); // error
const x = 1; // error
(function(Values) {
    Values.x = 1;
})(Values || (Values = {}));
var Values;
 // sketchy, but ok
//// [/main2.ts]
"use strict";
module.exports = {
    x: 1
};
//// [/main3.ts]
"use strict";
(function(ns) {
    ns.x = 1;
})(ns || (ns = {}));
var ns;
module.exports = ns;
//// [/main4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" // error
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = 1;
//// [/main5.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" // error
, {
    enumerable: true,
    get: function() {
        return C;
    }
});
class C {
}
//// [/main6.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" // error
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = I;
//// [/main7.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default" // error
, {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = esmy;
