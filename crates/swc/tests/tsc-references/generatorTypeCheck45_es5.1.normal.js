//@target: ES6
import regeneratorRuntime from "regenerator-runtime";
foo("", /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return function(x) {
                    return x.length;
                };
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}), function(p) {
    return undefined;
}); // T is fixed, should be string
