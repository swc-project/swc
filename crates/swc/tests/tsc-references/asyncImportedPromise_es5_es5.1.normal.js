import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @target: es5
// @lib: es5,es2015.promise
// @module: commonjs
// @filename: task.ts
export var Task = /*#__PURE__*/ function(Promise) {
    "use strict";
    _inherits(Task, Promise);
    var _super = _create_super(Task);
    function Task() {
        _class_call_check(this, Task);
        return _super.apply(this, arguments);
    }
    return Task;
}(_wrap_native_super(Promise));
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
    }
    var _proto = Test.prototype;
    _proto.example = function example() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return");
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return Test;
}();
