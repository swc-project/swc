define([
    "require",
    "exports",
    "foo",
    "foo-bar",
    "./directory/foo-bar",
    "foo2",
    "foo3",
    "foo4",
    "foo5"
], function(require, exports, _foo, _foobar, _foobar1, _foo2, _foo3, _foo4, _foo5) {
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
        test: function() {
            return test;
        },
        test2: function() {
            return test2;
        }
    });
    _foo2 = /*#__PURE__*/ _interop_require_default(_foo2);
    _foo3 = /*#__PURE__*/ _interop_require_wildcard(_foo3);
    var test;
    var test2 = 5;
    _foo4.bar;
    _foo5.foo;
    _foo2.default;
});
