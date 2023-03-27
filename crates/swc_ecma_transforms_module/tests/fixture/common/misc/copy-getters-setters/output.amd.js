define([
    "require",
    "exports",
    "./moduleWithGetter"
], function(require, exports, _module_with_getter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        baz: ()=>_module_with_getter.baz,
        Foo: ()=>_module_with_getter.default
    });
    _module_with_getter = /*#__PURE__*/ _interop_require_wildcard(_module_with_getter);
});
