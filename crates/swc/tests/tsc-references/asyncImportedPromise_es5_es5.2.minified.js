import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
export var Task = function(Promise) {
    "use strict";
    _inherits(Task, Promise);
    var _super = _create_super(Task);
    function Task() {
        return _class_call_check(this, Task), _super.apply(this, arguments);
    }
    return Task;
}(_wrap_native_super(Promise));
var Test = function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
    }
    return Test.prototype.example = function() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return");
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, Test;
}();
