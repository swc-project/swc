//// [importAssertion2.ts]
//// [0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get a () {
        return a;
    },
    get b () {
        return b;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
const a = 1, b = 2;
//// [1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get a () {
        return _0.a;
    },
    get b () {
        return _0.b;
    },
    get ns () {
        return _0;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
const _export_star = require("@swc/helpers/_/_export_star"), _0 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(_export_star._(require("./0"), exports));
//// [2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
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
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
const _0 = require("./0");
