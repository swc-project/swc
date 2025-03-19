//// [importAssertion2.ts]
//// [0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    a: function() {
        return a;
    },
    b: function() {
        return b;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
const a = 1, b = 2;
//// [1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    a: function() {
        return _0.a;
    },
    b: function() {
        return _0.b;
    },
    ns: function() {
        return _0;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
const _export_star = require("@swc/helpers/_/_export_star"), _0 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(_export_star._(require("./0"), exports));
//// [2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
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
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
const _0 = require("./0");
