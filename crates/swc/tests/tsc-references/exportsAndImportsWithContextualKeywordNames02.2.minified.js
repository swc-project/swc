//// [exportsAndImportsWithContextualKeywordNames02.ts]
//// [t1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    as: function() {
        return as;
    },
    return: function() {
        return as;
    }
});
var as = 100;
//// [t2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _t1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_wildcard")._(require("./t1"));
_t1.as, _t1.return;
//// [t3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
//// [t4.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
