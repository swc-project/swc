//// [usingDeclarationsTopLevelOfModule.1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get default () {
        return _default;
    },
    get w () {
        return w;
    },
    get x () {
        return x;
    },
    get y () {
        return y;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource"), _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources"), env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    var z = _ts_add_disposable_resource._(env, {
        [Symbol.dispose] () {}
    }, !1), y = 2;
    console.log(w, x, y, z);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources._(env);
}
let x = 1, w = 3, _default = 4;
