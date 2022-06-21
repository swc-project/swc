"use strict";
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _regeneratorRuntime = _interopRequireDefaultMjs(require("regenerator-runtime"));
require("reflect-metadata");
var v0 = function() {
    var _ref = _asyncToGeneratorMjs(_regeneratorRuntime.default.mark(function _callee(v1) {
        return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", v1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function(v1) {
        return _ref.apply(this, arguments);
    };
}().constructor;
var res = v0(function() {
    return Reflect.get(v3, "a");
});
console.log(res);
