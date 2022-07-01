define([
    "require",
    "exports",
    "./moduleWithGetter"
], function(require, exports, _moduleWithGetter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    _export(exports, {
        baz: ()=>_moduleWithGetter.baz,
        Foo: ()=>_moduleWithGetter.default
    });
    _moduleWithGetter = _interopRequireWildcard(_moduleWithGetter);
});
