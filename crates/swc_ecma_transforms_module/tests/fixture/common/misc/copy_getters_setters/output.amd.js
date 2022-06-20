define([
    "require",
    "exports",
    "./moduleWithGetter"
], function(require, exports, _moduleWithGetter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        Foo: function() {
            return _moduleWithGetter.default;
        },
        baz: function() {
            return _moduleWithGetter.baz;
        }
    });
    _moduleWithGetter = _interopRequireWildcard(_moduleWithGetter);
});
