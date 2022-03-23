"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var swcHelpers = require("@swc/helpers");
var _react = swcHelpers.interopRequireDefault(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: function() {
            var _ref = swcHelpers.asyncToGenerator(function*(e) {
                yield doSomething();
            });
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }()
    });
}
Foo.displayName = "Foo";
