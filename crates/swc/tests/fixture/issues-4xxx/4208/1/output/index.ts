import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
export var CompanyBgStore = function CompanyBgStore() {
    "use strict";
    swcHelpers.classCallCheck(this, CompanyBgStore);
    this.corpName = 123;
    var _this = this;
    this.getBusinessInfo = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var corpName, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    corpName = _args.length > 0 && _args[0] !== void 0 ? _args[0] : _this.corpName;
                    console.log(corpName);
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
};
