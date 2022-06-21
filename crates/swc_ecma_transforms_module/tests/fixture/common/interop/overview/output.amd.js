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
], function(require, exports, _foo, _fooBar, _fooBar1, _foo2, _foo3, _foo4, _foo5) {
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
        test: ()=>test,
        test2: ()=>test2
    });
    _foo2 = _interopRequireDefault(_foo2);
    _foo3 = _interopRequireWildcard(_foo3);
    var test;
    var test2 = 5;
    _foo4.bar;
    _foo5.foo;
    _foo2.default;
});
