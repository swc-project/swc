//// [defaultExportsCannotMerge01.ts]
//// [m1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var Decl, Decl1, target = exports, all = {
    get Decl () {
        return Decl;
    },
    get default () {
        return Decl;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
function Decl() {
    return 0;
}
(Decl1 = Decl || (Decl = {})).x = 10, Decl1.y = 20;
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = /*#__PURE__*/ require("@swc/helpers/_/_interop_require_default")._(require("m1"));
(0, _m1.default)(), _m1.default.x, _m1.default.y;
