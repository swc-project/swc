import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export var Task = function(Promise) {
    "use strict";
    swcHelpers.inherits(Task, Promise);
    var _super = swcHelpers.createSuper(Task);
    function Task() {
        return swcHelpers.classCallCheck(this, Task), _super.apply(this, arguments);
    }
    return Task;
}(swcHelpers.wrapNativeSuper(Promise));
var Test = function() {
    "use strict";
    function Test() {
        swcHelpers.classCallCheck(this, Test);
    }
    return Test.prototype.example = function() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
