//// [usingDeclarationsTopLevelOfModule.1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    default: function() {
        return _default;
    },
    w: function() {
        return w;
    },
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
const _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource"), _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources"), env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    let z = _ts_add_disposable_resource._(env, {
        [Symbol.dispose] () {}
    }, !1);
    console.log(w, x, 2, z);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources._(env);
}
const x = 1, w = 3, _default = 4;
