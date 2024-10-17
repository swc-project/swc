//// [usingDeclarationsTopLevelOfModule.2.ts]
const _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource"), _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources"), env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    let z = _ts_add_disposable_resource._(env, {
        [Symbol.dispose] () {}
    }, !1);
    console.log(2, z);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources._(env);
}
module.exports = 4;
