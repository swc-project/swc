function __swcpack_require__(mod) {
    var cache;
    if (cache) {
        return cache;
    }
    var module = {
        exports: {
        }
    };
    mod(module, module.exports);
    cache = module.exports;
    return cache;
}
var load = __swcpack_require__.bind(void 0, function(module, exports) {
    // This is a minimal reproduction from lodash@4.17.21
    function lodash(value) {
        console.log('lodash');
    }
    function memoize() {
        console.log('memoize');
    }
    lodash.memoize = memoize;
    // Either of these lines cause this module
    // not to be included in the bundle. Member expression
    // on `module` or `exports`.
    module.exports = lodash;
    exports.memoize = memoize; // NOTE: Indirection on `exports` will work
     //const exporter = exports;
     //exporter.memoize = memoize;
});
const _cjs_module_ = load(), memoize1 = _cjs_module_.memoize;
// Import directly from `lodash` instead and the module code is
// included in the bundle
//import {memoize} from './lodash';
const name = memoize1();
console.log(name);
