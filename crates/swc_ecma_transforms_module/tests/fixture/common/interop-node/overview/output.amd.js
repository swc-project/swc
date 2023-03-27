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
], function(require, exports, _foo, _foo_bar, _foo_bar1, _foo_2, _foo_3, _foo_4, _foo_5) {
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
        test: ()=>test,
        test2: ()=>test2
    });
    _foo_2 = _foo_2;
    _foo_3 = /*#__PURE__*/ _interop_require_wildcard(_foo_3, true);
    var test;
    var test2 = 5;
    _foo_4.bar;
    _foo_5.foo;
    _foo_2;
});
