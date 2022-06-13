import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
function f(a) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = // @target: esnext,es2015,es5
    // @lib: esnext
    // @noEmitHelpers: true
    // @noTypesAndSymbols: true
    // https://github.com/microsoft/TypeScript/issues/37686
    _wrap_async_generator(regeneratorRuntime.mark(function _callee(a) {
        var _b, c;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    c = (_b = a.b) !== null && _b !== void 0 ? _b : 10;
                case 2:
                    if (!c) {
                        _ctx.next = 7;
                        break;
                    }
                    _ctx.next = 5;
                    return c--;
                case 5:
                    _ctx.next = 2;
                    break;
                case 7:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f.apply(this, arguments);
}
