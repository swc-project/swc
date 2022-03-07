import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var Test = function Test(name) {
    "use strict";
    swcHelpers.classCallCheck(this, Test);
    var _this = this;
    this.print = function() {
        var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(arg) {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        console.log(_this.name, arg);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function(arg) {
            return _ref.apply(this, arguments);
        };
    }();
    this.name = name;
};
function Parent() {
    new Test('name').print('test');
}
