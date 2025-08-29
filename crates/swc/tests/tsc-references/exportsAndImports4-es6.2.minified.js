//// [exportsAndImports4-es6.ts]
//// [t1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
let _default = "hello";
//// [t2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
let _t1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./t1"));
require("./t1").default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default;
//// [t3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get a () {
        return a;
    },
    get b () {
        return _t1.default;
    },
    get c () {
        return _t1;
    },
    get d () {
        return _t1.default;
    },
    get e1 () {
        return _t1.default;
    },
    get e2 () {
        return _t1;
    },
    get f1 () {
        return _t1.default;
    },
    get f2 () {
        return _t1.default;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _t1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./t1")), a = require("./t1");
a.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default, _t1.default;
