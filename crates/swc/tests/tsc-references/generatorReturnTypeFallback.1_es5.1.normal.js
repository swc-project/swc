// @target: esnext
// @lib: es5,es2015.iterable
// @noemit: true
// @strict: true
// Allow generators to fallback to IterableIterator if they do not need a type for the sent value while in strictNullChecks mode.
import regeneratorRuntime from "regenerator-runtime";
var _marked = /*#__PURE__*/ regeneratorRuntime.mark(f);
function f() {
    return regeneratorRuntime.wrap(function f$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return 1;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
