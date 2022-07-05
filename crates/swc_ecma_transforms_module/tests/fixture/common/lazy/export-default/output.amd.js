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
        default: ()=>_foo.default,
        foo: ()=>_foo.default,
        bar: ()=>_bar.default
    });
    _foo = /*#__PURE__*/ _interopRequireDefault(_foo);
    _bar = /*#__PURE__*/ _interopRequireDefault(_bar);
});
