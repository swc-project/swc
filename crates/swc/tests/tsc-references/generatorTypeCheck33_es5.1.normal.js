import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(g);
//@target: ES6
function g() {
    var g2;
    return regeneratorRuntime.wrap(function g$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                g2 = regeneratorRuntime.mark(function g2() {
                    return regeneratorRuntime.wrap(function g2$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return "";
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, g2);
                });
                _ctx.next = 3;
                return 0;
            case 3:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
