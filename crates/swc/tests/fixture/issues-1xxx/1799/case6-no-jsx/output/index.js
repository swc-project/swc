"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Foo;
    }
});
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _regeneratorRuntime = /*#__PURE__*/ _interopRequireDefault(require("regenerator-runtime"));
var _react = /*#__PURE__*/ _interopRequireDefault(require("react"));
function Foo() {
    return call(_asyncToGenerator(_regeneratorRuntime.default.mark(function _callee(e) {
        return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return doSomething();
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    })));
}
Foo.displayName = "Foo";
