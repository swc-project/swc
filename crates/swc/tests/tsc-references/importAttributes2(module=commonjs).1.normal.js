//// [importAttributes2.ts]
"use strict";
//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get a () {
        return a;
    },
    get b () {
        return b;
    }
});
const a = 1;
const b = 2;
//// [1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get a () {
        return _0.a;
    },
    get b () {
        return _0.b;
    },
    get ns () {
        return _0;
    }
});
const _export_star = require("@swc/helpers/_/_export_star");
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _0 = /*#__PURE__*/ _interop_require_wildcard._(_export_star._(require("./0"), exports));
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get a () {
        return _0.a;
    },
    get b () {
        return _0.b;
    },
    get c () {
        return _0.a;
    },
    get d () {
        return _0.b;
    }
});
const _0 = require("./0");
