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
    default: function() {
        return Foo;
    }
});
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js");
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js");
var _regeneratorRuntime = (0, _interopRequireDefaultMjs.default)(require("regenerator-runtime"));
var _react = (0, _interopRequireDefaultMjs.default)(require("react"));
function Foo() {
    return call((0, _asyncToGeneratorMjs.default)(_regeneratorRuntime.default.mark(function _callee(e) {
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
