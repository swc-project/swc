import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(foo);
function foo() {
    return regeneratorRuntime.wrap(function foo$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.prev = 0;
                _ctx.next = 3;
                return call();
            case 3:
                return _ctx.abrupt("return", _ctx.sent);
            case 4:
                _ctx.prev = 4;
                return _ctx.finish(4);
            case 6:
            case "end":
                return _ctx.stop();
        }
    }, _marked, null, [
        [
            0,
            ,
            4,
            6
        ]
    ]);
}
