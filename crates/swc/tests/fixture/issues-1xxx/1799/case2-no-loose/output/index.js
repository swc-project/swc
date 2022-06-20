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
    default: ()=>Foo
});
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js");
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js");
var _react = (0, _interopRequireDefaultMjs.default)(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: function() {
            var _ref = (0, _asyncToGeneratorMjs.default)(function*(e) {
                yield doSomething();
            });
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }()
    });
}
Foo.displayName = "Foo";
