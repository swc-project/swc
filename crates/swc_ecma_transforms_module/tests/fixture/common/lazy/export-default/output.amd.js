define([
    "require",
    "exports",
    "foo",
    "bar"
], function(require, exports, _foo, _bar) {
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
        bar: function() {
            return _bar.default;
        },
        default: function() {
            return _foo.default;
        },
        foo: function() {
            return _foo.default;
        }
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    _bar = /*#__PURE__*/ _interop_require_default(_bar);
});
