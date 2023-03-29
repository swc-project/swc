porter.define([
    "foo",
    "foo-bar",
    "./directory/foo-bar"
], function(require, exports) {
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
        foo: ()=>_foo.default,
        test2: ()=>test2,
        default: ()=>_default
    });
    const _foo = /*#__PURE__*/ _interopRequireWildcard(require("foo"));
    require("foo-bar");
    require("./directory/foo-bar");
    var test2 = 5;
    const _default = _foo.default;
    Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./baz"))).then((exports)=>exports.baz());
});
