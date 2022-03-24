import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var resolver = {
    sendSomeMessage: function sendSomeMessage(_parent, _param, _param1) {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var _input, toNumber, messageBody, all, dataSources;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _input = _param.input, toNumber = _input.toNumber, messageBody = _input.messageBody, all = swcHelpers.objectWithoutProperties(_param.input, [
                            "toNumber",
                            "messageBody"
                        ]), dataSources = _param1.dataSources;
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
export default resolver;
