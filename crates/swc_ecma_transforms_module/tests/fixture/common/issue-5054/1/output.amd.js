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
        default: ()=>_default,
        y: ()=>y
    });
    _foo = /*#__PURE__*/ _interopRequireDefault(_foo);
    _baz = /*#__PURE__*/ _interopRequireWildcard(_baz);
    var _default = {
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
