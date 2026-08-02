//// [verbatimModuleSyntaxRestrictionsCJS.ts]
"use strict";
//// [/decl.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
let _default = esmy;
//// [/ambient.d.ts]
"use strict";
//// [/main.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var Values, target = exports, all = {
    get Values () {
        return Values;
    },
    get x () {
        return x;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
/*#__PURE__*/ require("./decl"), Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./decl")));
let x = 1;
(Values || (Values = {})).x = 1;
//// [/main2.ts]
"use strict";
module.exports = {
    x: 1
};
//// [/main3.ts]
"use strict";
var ns;
(ns || (ns = {})).x = 1, module.exports = ns;
//// [/main4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
let _default = 1;
//// [/main5.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return C;
    }
});
class C {
}
//// [/main6.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
let _default = I;
//// [/main7.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
let _default = esmy;
