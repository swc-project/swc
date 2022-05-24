import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
import regeneratorRuntime from "regenerator-runtime";
var _bar, _baz, _qux, _marked = regeneratorRuntime.mark(baz);
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    return (_bar1 = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, Promise.resolve(42);
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function baz() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, 42;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
function qux() {
    return _qux1.apply(this, arguments);
}
function _qux1() {
    return (_qux1 = _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, _await_async_generator(Promise.resolve(42));
                case 2:
                    return _ctx.next = 4, _ctx.sent;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
new (_bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class), _class_private_method_init(this, _bar), _class_private_method_init(this, _baz), _class_private_method_init(this, _qux);
    }
    return _class.prototype.foo = function() {
        var _this = this;
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var b;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, _class_private_method_get(_this, _bar, bar).call(_this);
                    case 2:
                        return b = _ctx.sent, _ctx.t0 = b + (_class_private_method_get(_this, _baz, baz).call(_this).next().value || 0), _ctx.next = 6, _class_private_method_get(_this, _qux, qux).call(_this).next();
                    case 6:
                        if (_ctx.t1 = _ctx.sent.value, _ctx.t1) {
                            _ctx.next = 9;
                            break;
                        }
                        _ctx.t1 = 0;
                    case 9:
                        return _ctx.t2 = _ctx.t1, _ctx.abrupt("return", _ctx.t0 + _ctx.t2);
                    case 11:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _class;
}())().foo().then(console.log);
