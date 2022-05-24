"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _react = _interop_require_default(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: function() {
            var _ref = _async_to_generator(function*(e) {
                yield doSomething();
            });
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }()
    });
}
Foo.displayName = "Foo";
