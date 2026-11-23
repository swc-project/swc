//// [usingDeclarationsTopLevelOfModule.1.ts]
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
});
const _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource");
const _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources");
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var x = 1;
    var z = _ts_add_disposable_resource._(env, {
        [Symbol.dispose] () {}
    }, false);
    var y = 2;
    var w = 3;
    console.log(w, x, y, z);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources._(env);
}
const _default = 4;
