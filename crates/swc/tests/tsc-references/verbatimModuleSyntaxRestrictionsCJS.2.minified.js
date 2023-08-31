//// [verbatimModuleSyntaxRestrictionsCJS.ts]
//// [/decl.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
const _default = esmy;
//// [/ambient.d.ts]
//// [/main.ts]
var Values;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    Values: function() {
        return Values;
    },
    x: function() {
        return x;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./decl")));
const x = 1; // error
(Values || (Values = {})).x = 1;
 // sketchy, but ok
//// [/main2.ts]
module.exports = {
    x: 1
};
//// [/main3.ts]
var ns;
(ns || (ns = {})).x = 1, module.exports = ns;
//// [/main4.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default" // error
, {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
const _default = 1;
//// [/main5.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default" // error
, {
    enumerable: !0,
    get: function() {
        return C;
    }
});
class C {
}
//// [/main6.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
 // error
//// [/main7.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
 // error
