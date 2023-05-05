define([
    "require",
    "exports",
    "foo",
    "bar",
    "baz"
], function(require, exports, _foo, _bar, _baz) {
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
        default: function() {
            return _default;
        },
        y: function() {
            return y;
        }
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    _baz = /*#__PURE__*/ _interop_require_wildcard(_baz);
    const _default = {
        foo: _foo.default,
        baz: _baz,
        baz: _baz
    };
    const x = {
        foo: _foo.default,
        bar: _bar.bar,
        baz: _baz
    };
    const y = {
        foo: _foo.default,
        bar: _bar.bar,
        baz: _baz
    };
});
