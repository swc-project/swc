import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @target: es2015
// @lib: esnext
// @filename: O1.ts
var o1 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
// @filename: O2.ts
var o2 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return;
                    case 2:
                        x = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
// @filename: O3.ts
var o3 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return 1;
                    case 2:
                        x = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
// @filename: O4.ts
var o4 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.delegateYield(_async_generator_delegate(_async_iterator([
                            1
                        ]), _await_async_generator), "t0", 1);
                    case 1:
                        x = _ctx.t0;
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
// @filename: O5.ts
var o5 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.delegateYield(_async_generator_delegate(_async_iterator(_wrap_async_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                while(1)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        _ctx.next = 2;
                                        return 1;
                                    case 2:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }))()), _await_async_generator), "t0", 1);
                    case 1:
                        x = _ctx.t0;
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
// @filename: O6.ts
var o6 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var x;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _await_async_generator(1);
                    case 2:
                        x = _ctx.sent;
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
// @filename: O7.ts
var o7 = {
    f: function f() {
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return", 1);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }
};
