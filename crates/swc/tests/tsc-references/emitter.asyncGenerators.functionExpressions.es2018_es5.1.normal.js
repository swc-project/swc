function AsyncGenerator(gen) {
    var front, back;
    function send(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            if (back) {
                back = back.next = request;
            } else {
                front = back = request;
                resume(key, arg);
            }
        });
    }
    function resume(key, arg) {
        try {
            var result = gen[key](arg);
            var value = result.value;
            var wrappedAwait = value instanceof _AwaitValue;
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
                    done: true
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: false
                });
                break;
        }
        front = front.next;
        if (front) {
            resume(front.key, front.arg);
        } else {
            back = null;
        }
    }
    this._invoke = send;
    if (typeof gen.return !== "function") {
        this.return = undefined;
    }
}
if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
        return this;
    };
}
AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
};
AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
};
AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
import regeneratorRuntime from "regenerator-runtime";
// @target: es2018
// @lib: esnext
// @filename: F1.ts
var f1 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f1() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F2.ts
var f2 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    }));
    return function f2() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F3.ts
var f3 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    }));
    return function f3() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F4.ts
var f4 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield([
                        1
                    ], "t0", 1);
                case 1:
                    x = _ctx.t0;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f4() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F5.ts
var f5 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    return _ctx1.delegateYield(_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
                    }))(), "t0", 1);
                case 1:
                    x = _ctx1.t0;
                case 2:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee1);
    }));
    return function f5() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F6.ts
var f6 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return _awaitAsyncGenerator(1);
                case 2:
                    x = _ctx.sent;
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f6() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F7.ts
var f7 = function() {
    var _ref = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", 1);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function f7() {
        return _ref.apply(this, arguments);
    };
}();
