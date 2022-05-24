import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", {
                        key: "value"
                    });
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn1.apply(this, arguments);
}
function fn2() {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", new Promise(function(resolve) {
                        resolve({
                            key: "value"
                        });
                    }));
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn2.apply(this, arguments);
}
function fn3() {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return {
                        key: "value"
                    };
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn3.apply(this, arguments);
}
function fn4() {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return new Promise(function(resolve) {
                        resolve({
                            key: "value"
                        });
                    });
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn4.apply(this, arguments);
}
