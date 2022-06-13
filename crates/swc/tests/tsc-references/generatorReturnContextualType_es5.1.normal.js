import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(f1);
// @target: esnext
// @strict: true
// #35995
function f1() {
    return regeneratorRuntime.wrap(function f1$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.abrupt("return", {
                    x: "x"
                });
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", {
                        x: "x"
                    });
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", Promise.resolve({
                        x: "x"
                    }));
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f3.apply(this, arguments);
}
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        var ret;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ret = {
                        x: "x"
                    };
                    return _ctx.abrupt("return", Promise.resolve(ret));
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f4.apply(this, arguments);
}
