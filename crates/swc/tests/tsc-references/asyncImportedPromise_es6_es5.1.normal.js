import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @target: es6
// @module: commonjs
// @filename: task.ts
export var Task = /*#__PURE__*/ function(Promise) {
    "use strict";
    swcHelpers.inherits(Task, Promise);
    var _super = swcHelpers.createSuper(Task);
    function Task() {
        swcHelpers.classCallCheck(this, Task);
        return _super.apply(this, arguments);
    }
    return Task;
}(swcHelpers.wrapNativeSuper(Promise));
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        swcHelpers.classCallCheck(this, Test);
    }
    var _proto = Test.prototype;
    _proto.example = function example() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
