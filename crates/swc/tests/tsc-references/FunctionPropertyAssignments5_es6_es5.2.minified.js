import regeneratorRuntime from "regenerator-runtime";
!function(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}({}, foo(), regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}));
