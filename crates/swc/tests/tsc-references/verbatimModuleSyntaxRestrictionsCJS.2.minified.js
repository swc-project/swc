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
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
/*#__PURE__*/ require("./decl"), Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./decl")));
const x = 1;
(Values || (Values = {})).x = 1;
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
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
const _default = 1;
//// [/main5.ts]
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
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
const _default = I;
//// [/main7.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
const _default = esmy;
