import regeneratorRuntime from "regenerator-runtime";
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _asyncIterator(iterable) {
    var method;
    if ("function" == typeof Symbol) {
        if (Symbol.asyncIterator && null != (method = iterable[Symbol.asyncIterator])) return method.call(iterable);
        if (Symbol.iterator && null != (method = iterable[Symbol.iterator])) return method.call(iterable);
    }
    throw new TypeError("Object is not async iterable");
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
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
            _next(void 0);
        });
    };
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || (function(arr, i) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
            for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                _n || null == _i.return || _i.return();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    })(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || _iterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
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
var _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield(g1, "t0", 1);
            case 1:
                return _ctx.delegateYield(g3, "t1", 2);
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
});
_toConsumableArray(g1), _toConsumableArray(g2), _slicedToArray(g1, 1)[0], _slicedToArray(g2, 1)[0], _toArray(g1).slice(0), _toArray(g2).slice(0), _ = g1[0], _ = g2[0], _ = g1.slice(0), _ = g2.slice(0);
var _iteratorNormalCompletion = !0, _didIteratorError5 = !1, _iteratorError5 = void 0;
try {
    for(var _step, _iterator = g1[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)_ = _step.value;
} catch (err) {
    _didIteratorError5 = !0, _iteratorError5 = err;
} finally{
    try {
        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
    } finally{
        if (_didIteratorError5) throw _iteratorError5;
    }
}
var _iteratorNormalCompletion1 = !0, _didIteratorError1 = !1, _iteratorError1 = void 0;
try {
    for(var _step1, _iterator1 = g2[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = !0)_ = _step1.value;
} catch (err) {
    _didIteratorError1 = !0, _iteratorError1 = err;
} finally{
    try {
        _iteratorNormalCompletion1 || null == _iterator1.return || _iterator1.return();
    } finally{
        if (_didIteratorError1) throw _iteratorError1;
    }
}
function _asyncfn() {
    return (_asyncfn = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, _iteratorAbruptCompletion1, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value1, _iteratorAbruptCompletion2, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value2, _iteratorAbruptCompletion3, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value3;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 1, _iterator = _asyncIterator(g1);
                case 3:
                    return _ctx.next = 5, _iterator.next();
                case 5:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 10;
                        break;
                    }
                    _ = _value = _step.value;
                case 7:
                    _iteratorAbruptCompletion = !1, _ctx.next = 3;
                    break;
                case 10:
                    _ctx.next = 16;
                    break;
                case 12:
                    _ctx.prev = 12, _ctx.t0 = _ctx.catch(1), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 16:
                    if (_ctx.prev = 16, _ctx.prev = 17, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 21;
                        break;
                    }
                    return _ctx.next = 21, _iteratorError.return();
                case 21:
                    if (_ctx.prev = 21, !_didIteratorError) {
                        _ctx.next = 24;
                        break;
                    }
                    throw _iteratorError;
                case 24:
                    return _ctx.finish(21);
                case 25:
                    return _ctx.finish(16);
                case 26:
                    _iteratorAbruptCompletion1 = !1, _didIteratorError2 = !1, _ctx.prev = 27, _iterator2 = _asyncIterator(g2);
                case 29:
                    return _ctx.next = 31, _iterator2.next();
                case 31:
                    if (!(_iteratorAbruptCompletion1 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 36;
                        break;
                    }
                    _ = _value1 = _step2.value;
                case 33:
                    _iteratorAbruptCompletion1 = !1, _ctx.next = 29;
                    break;
                case 36:
                    _ctx.next = 42;
                    break;
                case 38:
                    _ctx.prev = 38, _ctx.t1 = _ctx.catch(27), _didIteratorError2 = !0, _iteratorError2 = _ctx.t1;
                case 42:
                    if (_ctx.prev = 42, _ctx.prev = 43, !(_iteratorAbruptCompletion1 && null != _iterator2.return)) {
                        _ctx.next = 47;
                        break;
                    }
                    return _ctx.next = 47, _iteratorError2.return();
                case 47:
                    if (_ctx.prev = 47, !_didIteratorError2) {
                        _ctx.next = 50;
                        break;
                    }
                    throw _iteratorError2;
                case 50:
                    return _ctx.finish(47);
                case 51:
                    return _ctx.finish(42);
                case 52:
                    _iteratorAbruptCompletion2 = !1, _didIteratorError3 = !1, _ctx.prev = 53, _iterator3 = _asyncIterator(g4);
                case 55:
                    return _ctx.next = 57, _iterator3.next();
                case 57:
                    if (!(_iteratorAbruptCompletion2 = !(_step3 = _ctx.sent).done)) {
                        _ctx.next = 62;
                        break;
                    }
                    _ = _value2 = _step3.value;
                case 59:
                    _iteratorAbruptCompletion2 = !1, _ctx.next = 55;
                    break;
                case 62:
                    _ctx.next = 68;
                    break;
                case 64:
                    _ctx.prev = 64, _ctx.t2 = _ctx.catch(53), _didIteratorError3 = !0, _iteratorError3 = _ctx.t2;
                case 68:
                    if (_ctx.prev = 68, _ctx.prev = 69, !(_iteratorAbruptCompletion2 && null != _iterator3.return)) {
                        _ctx.next = 73;
                        break;
                    }
                    return _ctx.next = 73, _iteratorError3.return();
                case 73:
                    if (_ctx.prev = 73, !_didIteratorError3) {
                        _ctx.next = 76;
                        break;
                    }
                    throw _iteratorError3;
                case 76:
                    return _ctx.finish(73);
                case 77:
                    return _ctx.finish(68);
                case 78:
                    _iteratorAbruptCompletion3 = !1, _didIteratorError4 = !1, _ctx.prev = 79, _iterator4 = _asyncIterator(g5);
                case 81:
                    return _ctx.next = 83, _iterator4.next();
                case 83:
                    if (!(_iteratorAbruptCompletion3 = !(_step4 = _ctx.sent).done)) {
                        _ctx.next = 88;
                        break;
                    }
                    _ = _value3 = _step4.value;
                case 85:
                    _iteratorAbruptCompletion3 = !1, _ctx.next = 81;
                    break;
                case 88:
                    _ctx.next = 94;
                    break;
                case 90:
                    _ctx.prev = 90, _ctx.t3 = _ctx.catch(79), _didIteratorError4 = !0, _iteratorError4 = _ctx.t3;
                case 94:
                    if (_ctx.prev = 94, _ctx.prev = 95, !(_iteratorAbruptCompletion3 && null != _iterator4.return)) {
                        _ctx.next = 99;
                        break;
                    }
                    return _ctx.next = 99, _iteratorError4.return();
                case 99:
                    if (_ctx.prev = 99, !_didIteratorError4) {
                        _ctx.next = 102;
                        break;
                    }
                    throw _iteratorError4;
                case 102:
                    return _ctx.finish(99);
                case 103:
                    return _ctx.finish(94);
                case 104:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                12,
                16,
                26
            ],
            [
                17,
                ,
                21,
                25
            ],
            [
                27,
                38,
                42,
                52
            ],
            [
                43,
                ,
                47,
                51
            ],
            [
                53,
                64,
                68,
                78
            ],
            [
                69,
                ,
                73,
                77
            ],
            [
                79,
                90,
                94,
                104
            ],
            [
                95,
                ,
                99,
                103
            ]
        ]);
    }))).apply(this, arguments);
}
function _f2() {
    return (_f2 = (function(fn) {
        return function() {
            return new AsyncGenerator(fn.apply(this, arguments));
        };
    })(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.delegateYield(g1, "t0", 1);
                case 1:
                    return _ctx.delegateYield(g3, "t1", 2);
                case 2:
                    return _ctx.delegateYield(g4, "t2", 3);
                case 3:
                    return _ctx.delegateYield(g6, "t3", 4);
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _f3() {
    return (_f3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var syncGenerator, o, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function(_ctx1) {
            for(;;)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    syncGenerator = regeneratorRuntime.mark(function() {
                        return regeneratorRuntime.wrap(function(_ctx) {
                            for(;;)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    return _ctx.next = 2, 1;
                                case 2:
                                    return _ctx.next = 4, 2;
                                case 4:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, syncGenerator);
                    }), o = _defineProperty({
                    }, Symbol.asyncIterator, syncGenerator), _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx1.prev = 3, _iterator = _asyncIterator(o);
                case 5:
                    return _ctx1.next = 7, _iterator.next();
                case 7:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx1.sent).done)) {
                        _ctx1.next = 12;
                        break;
                    }
                    x = _value = _step.value;
                case 9:
                    _iteratorAbruptCompletion = !1, _ctx1.next = 5;
                    break;
                case 12:
                    _ctx1.next = 18;
                    break;
                case 14:
                    _ctx1.prev = 14, _ctx1.t0 = _ctx1.catch(3), _didIteratorError = !0, _iteratorError = _ctx1.t0;
                case 18:
                    if (_ctx1.prev = 18, _ctx1.prev = 19, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx1.next = 23;
                        break;
                    }
                    return _ctx1.next = 23, _iteratorError.return();
                case 23:
                    if (_ctx1.prev = 23, !_didIteratorError) {
                        _ctx1.next = 26;
                        break;
                    }
                    throw _iteratorError;
                case 26:
                    return _ctx1.finish(23);
                case 27:
                    return _ctx1.finish(18);
                case 28:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee, null, [
            [
                3,
                14,
                18,
                28
            ],
            [
                19,
                ,
                23,
                27
            ]
        ]);
    }))).apply(this, arguments);
}
