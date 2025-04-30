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
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get bar () {
            return _bar.default;
        },
        get default () {
            return _foo.default;
        },
        get foo () {
            return _foo.default;
        }
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    _bar = /*#__PURE__*/ _interop_require_default(_bar);
});
