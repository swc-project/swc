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
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(baz);
var _bar, _baz, _qux, _class;
// @target: es2019
var C = (_bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        _classCallCheck(this, _class1);
        _classPrivateMethodInit(this, _bar);
        _classPrivateMethodInit(this, _baz);
        _classPrivateMethodInit(this, _qux);
    }
    _createClass(_class1, [
        {
            key: "foo",
            value: function foo() {
                var _this = this;
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var b;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return _classPrivateMethodGet(_this, _bar, bar).call(_this);
                            case 2:
                                b = _ctx.sent;
                                _ctx.t0 = b + (_classPrivateMethodGet(_this, _baz, baz).call(_this).next().value || 0);
                                _ctx.next = 6;
                                return _classPrivateMethodGet(_this, _qux, qux).call(_this).next();
                            case 6:
                                _ctx.t1 = _ctx.sent.value;
                                if (_ctx.t1) {
                                    _ctx.next = 9;
                                    break;
                                }
                                _ctx.t1 = 0;
                            case 9:
                                _ctx.t2 = _ctx.t1;
                                return _ctx.abrupt("return", _ctx.t0 + _ctx.t2);
                            case 11:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return _class1;
}(), _class);
new C().foo().then(console.log);
function bar() {
    return _bar1.apply(this, arguments);
}
function _bar1() {
    _bar1 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return Promise.resolve(42);
                case 2:
                    return _ctx.abrupt("return", _ctx.sent);
                case 3:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _bar1.apply(this, arguments);
}
function baz() {
    return regeneratorRuntime.wrap(function baz$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return 42;
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
    _qux1 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return _awaitAsyncGenerator(Promise.resolve(42));
                case 2:
                    _ctx.next = 4;
                    return _ctx.sent;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _qux1.apply(this, arguments);
}
