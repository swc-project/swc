function AsyncGenerator(gen) {
    var front, back;
    function resume(key, arg) {
        try {
            var result = gen[key](arg), value = result.value, wrappedAwait = value instanceof _AwaitValue;
            Promise.resolve(wrappedAwait ? value.wrapped : value).then(function(arg) {
                if (wrappedAwait) {
                    resume("next", arg);
                    return;
                }
                settle(result.done ? "return" : "normal", arg);
            }, function(err) {
                resume("throw", err);
            });
        } catch (err) {
            settle("throw", err);
        }
    }
    function settle(type, value) {
        switch(type){
            case "return":
                front.resolve({
                    value: value,
                    done: !0
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: !1
                });
                break;
        }
        (front = front.next) ? resume(front.key, front.arg) : back = null;
    }
    this._invoke = function(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            back ? back = back.next = request : (front = back = request, resume(key, arg));
        });
    }, "function" != typeof gen.return && (this.return = void 0);
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
"function" == typeof Symbol && Symbol.asyncIterator && (AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
    return this;
}), AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
}, AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
}, AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
import regeneratorRuntime from "regenerator-runtime";
function inferReturnType2() {
    return _inferReturnType2.apply(this, arguments);
}
function _inferReturnType2() {
    return (_inferReturnType2 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(inferReturnType2(), "t0", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, "a";
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([
                    "a",
                    "b"
                ], "t0", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
    return regeneratorRuntime.wrap(function(_ctx1) {
        for(;;)switch(_ctx1.prev = _ctx1.next){
            case 0:
                return _ctx1.delegateYield(_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, "a";
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))(), "t0", 1);
            case 1:
            case "end":
                return _ctx1.stop();
        }
    }, _callee1);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, "a";
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([
                    "a",
                    "b"
                ], "t0", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function(_ctx2) {
        for(;;)switch(_ctx2.prev = _ctx2.next){
            case 0:
                return _ctx2.delegateYield(_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, "a";
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))(), "t0", 1);
            case 1:
            case "end":
                return _ctx2.stop();
        }
    }, _callee2);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, "a";
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([
                    "a",
                    "b"
                ], "t0", 1);
            case 1:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
})), _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function(_ctx3) {
        for(;;)switch(_ctx3.prev = _ctx3.next){
            case 0:
                return _ctx3.delegateYield(_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, "a";
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))(), "t0", 1);
            case 1:
            case "end":
                return _ctx3.stop();
        }
    }, _callee3);
}));
