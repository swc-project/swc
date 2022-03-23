import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var source = Math.random() < 2 ? "matilda" : "fred";
var details = {
    _id: "1"
};
function request(path) {
    return _request.apply(this, arguments);
}
function _request() {
    _request = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", "success:".concat(path));
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _request.apply(this, arguments);
}
swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var obj;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!(source === "matilda")) {
                    _ctx.next = 4;
                    break;
                }
                _ctx.t0 = details;
                _ctx.next = 7;
                break;
            case 4:
                _ctx.next = 6;
                return request("/".concat(details._id, "?source=").concat(source));
            case 6:
                _ctx.t0 = _ctx.sent;
            case 7:
                obj = _ctx.t0;
                console.log({
                    obj: obj
                });
            case 9:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
