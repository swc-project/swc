import regeneratorRuntime from "regenerator-runtime";
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
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _f1() {
    return (_f1 = (function(fn) {
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
    })(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, x1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, x2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _value5;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(asyncIterable);
                case 4:
                    return _ctx.next = 6, _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _iteratorAbruptCompletion1 = !1, _didIteratorError1 = !1, _ctx.prev = 28, _iterator1 = _asyncIterator(iterable);
                case 30:
                    return _ctx.next = 32, _iterator1.next();
                case 32:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _ctx.sent).done)) {
                        _ctx.next = 37;
                        break;
                    }
                    x1 = _value1 = _step1.value;
                case 34:
                    _iteratorAbruptCompletion1 = !1, _ctx.next = 30;
                    break;
                case 37:
                    _ctx.next = 43;
                    break;
                case 39:
                    _ctx.prev = 39, _ctx.t1 = _ctx.catch(28), _didIteratorError1 = !0, _iteratorError1 = _ctx.t1;
                case 43:
                    if (_ctx.prev = 43, _ctx.prev = 44, !(_iteratorAbruptCompletion1 && null != _iterator1.return)) {
                        _ctx.next = 48;
                        break;
                    }
                    return _ctx.next = 48, _iteratorError1.return();
                case 48:
                    if (_ctx.prev = 48, !_didIteratorError1) {
                        _ctx.next = 51;
                        break;
                    }
                    throw _iteratorError1;
                case 51:
                    return _ctx.finish(48);
                case 52:
                    return _ctx.finish(43);
                case 53:
                    _iteratorAbruptCompletion2 = !1, _didIteratorError2 = !1, _ctx.prev = 54, _iterator2 = _asyncIterator(iterableOfPromise);
                case 56:
                    return _ctx.next = 58, _iterator2.next();
                case 58:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 63;
                        break;
                    }
                    x2 = _value2 = _step2.value;
                case 60:
                    _iteratorAbruptCompletion2 = !1, _ctx.next = 56;
                    break;
                case 63:
                    _ctx.next = 69;
                    break;
                case 65:
                    _ctx.prev = 65, _ctx.t2 = _ctx.catch(54), _didIteratorError2 = !0, _iteratorError2 = _ctx.t2;
                case 69:
                    if (_ctx.prev = 69, _ctx.prev = 70, !(_iteratorAbruptCompletion2 && null != _iterator2.return)) {
                        _ctx.next = 74;
                        break;
                    }
                    return _ctx.next = 74, _iteratorError2.return();
                case 74:
                    if (_ctx.prev = 74, !_didIteratorError2) {
                        _ctx.next = 77;
                        break;
                    }
                    throw _iteratorError2;
                case 77:
                    return _ctx.finish(74);
                case 78:
                    return _ctx.finish(69);
                case 79:
                    _iteratorAbruptCompletion3 = !1, _didIteratorError3 = !1, _ctx.prev = 80, _iterator3 = _asyncIterator(asyncIterable);
                case 82:
                    return _ctx.next = 84, _iterator3.next();
                case 84:
                    if (!(_iteratorAbruptCompletion3 = !(_step3 = _ctx.sent).done)) {
                        _ctx.next = 89;
                        break;
                    }
                    y = _value3 = _step3.value;
                case 86:
                    _iteratorAbruptCompletion3 = !1, _ctx.next = 82;
                    break;
                case 89:
                    _ctx.next = 95;
                    break;
                case 91:
                    _ctx.prev = 91, _ctx.t3 = _ctx.catch(80), _didIteratorError3 = !0, _iteratorError3 = _ctx.t3;
                case 95:
                    if (_ctx.prev = 95, _ctx.prev = 96, !(_iteratorAbruptCompletion3 && null != _iterator3.return)) {
                        _ctx.next = 100;
                        break;
                    }
                    return _ctx.next = 100, _iteratorError3.return();
                case 100:
                    if (_ctx.prev = 100, !_didIteratorError3) {
                        _ctx.next = 103;
                        break;
                    }
                    throw _iteratorError3;
                case 103:
                    return _ctx.finish(100);
                case 104:
                    return _ctx.finish(95);
                case 105:
                    _iteratorAbruptCompletion4 = !1, _didIteratorError4 = !1, _ctx.prev = 106, _iterator4 = _asyncIterator(iterable);
                case 108:
                    return _ctx.next = 110, _iterator4.next();
                case 110:
                    if (!(_iteratorAbruptCompletion4 = !(_step4 = _ctx.sent).done)) {
                        _ctx.next = 115;
                        break;
                    }
                    y = _value4 = _step4.value;
                case 112:
                    _iteratorAbruptCompletion4 = !1, _ctx.next = 108;
                    break;
                case 115:
                    _ctx.next = 121;
                    break;
                case 117:
                    _ctx.prev = 117, _ctx.t4 = _ctx.catch(106), _didIteratorError4 = !0, _iteratorError4 = _ctx.t4;
                case 121:
                    if (_ctx.prev = 121, _ctx.prev = 122, !(_iteratorAbruptCompletion4 && null != _iterator4.return)) {
                        _ctx.next = 126;
                        break;
                    }
                    return _ctx.next = 126, _iteratorError4.return();
                case 126:
                    if (_ctx.prev = 126, !_didIteratorError4) {
                        _ctx.next = 129;
                        break;
                    }
                    throw _iteratorError4;
                case 129:
                    return _ctx.finish(126);
                case 130:
                    return _ctx.finish(121);
                case 131:
                    _iteratorAbruptCompletion5 = !1, _didIteratorError5 = !1, _ctx.prev = 132, _iterator5 = _asyncIterator(iterableOfPromise);
                case 134:
                    return _ctx.next = 136, _iterator5.next();
                case 136:
                    if (!(_iteratorAbruptCompletion5 = !(_step5 = _ctx.sent).done)) {
                        _ctx.next = 141;
                        break;
                    }
                    y = _value5 = _step5.value;
                case 138:
                    _iteratorAbruptCompletion5 = !1, _ctx.next = 134;
                    break;
                case 141:
                    _ctx.next = 147;
                    break;
                case 143:
                    _ctx.prev = 143, _ctx.t5 = _ctx.catch(132), _didIteratorError5 = !0, _iteratorError5 = _ctx.t5;
                case 147:
                    if (_ctx.prev = 147, _ctx.prev = 148, !(_iteratorAbruptCompletion5 && null != _iterator5.return)) {
                        _ctx.next = 152;
                        break;
                    }
                    return _ctx.next = 152, _iteratorError5.return();
                case 152:
                    if (_ctx.prev = 152, !_didIteratorError5) {
                        _ctx.next = 155;
                        break;
                    }
                    throw _iteratorError5;
                case 155:
                    return _ctx.finish(152);
                case 156:
                    return _ctx.finish(147);
                case 157:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ],
            [
                28,
                39,
                43,
                53
            ],
            [
                44,
                ,
                48,
                52
            ],
            [
                54,
                65,
                69,
                79
            ],
            [
                70,
                ,
                74,
                78
            ],
            [
                80,
                91,
                95,
                105
            ],
            [
                96,
                ,
                100,
                104
            ],
            [
                106,
                117,
                121,
                131
            ],
            [
                122,
                ,
                126,
                130
            ],
            [
                132,
                143,
                147,
                157
            ],
            [
                148,
                ,
                152,
                156
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
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _value6, x3, _iteratorAbruptCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _value7, x4, _iteratorAbruptCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _value8, _iteratorAbruptCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _value9, _iteratorAbruptCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _value10;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(asyncIterable);
                case 4:
                    return _ctx.next = 6, _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _iteratorAbruptCompletion6 = !1, _didIteratorError6 = !1, _ctx.prev = 28, _iterator6 = _asyncIterator(iterable);
                case 30:
                    return _ctx.next = 32, _awaitAsyncGenerator(_iterator6.next());
                case 32:
                    if (!(_iteratorAbruptCompletion6 = !(_step6 = _ctx.sent).done)) {
                        _ctx.next = 37;
                        break;
                    }
                    x3 = _value6 = _step6.value;
                case 34:
                    _iteratorAbruptCompletion6 = !1, _ctx.next = 30;
                    break;
                case 37:
                    _ctx.next = 43;
                    break;
                case 39:
                    _ctx.prev = 39, _ctx.t1 = _ctx.catch(28), _didIteratorError6 = !0, _iteratorError6 = _ctx.t1;
                case 43:
                    if (_ctx.prev = 43, _ctx.prev = 44, !(_iteratorAbruptCompletion6 && null != _iterator6.return)) {
                        _ctx.next = 48;
                        break;
                    }
                    return _ctx.next = 48, _iteratorError6.return();
                case 48:
                    if (_ctx.prev = 48, !_didIteratorError6) {
                        _ctx.next = 51;
                        break;
                    }
                    throw _iteratorError6;
                case 51:
                    return _ctx.finish(48);
                case 52:
                    return _ctx.finish(43);
                case 53:
                    _iteratorAbruptCompletion7 = !1, _didIteratorError7 = !1, _ctx.prev = 54, _iterator7 = _asyncIterator(iterableOfPromise);
                case 56:
                    return _ctx.next = 58, _awaitAsyncGenerator(_iterator7.next());
                case 58:
                    if (!(_iteratorAbruptCompletion7 = !(_step7 = _ctx.sent).done)) {
                        _ctx.next = 63;
                        break;
                    }
                    x4 = _value7 = _step7.value;
                case 60:
                    _iteratorAbruptCompletion7 = !1, _ctx.next = 56;
                    break;
                case 63:
                    _ctx.next = 69;
                    break;
                case 65:
                    _ctx.prev = 65, _ctx.t2 = _ctx.catch(54), _didIteratorError7 = !0, _iteratorError7 = _ctx.t2;
                case 69:
                    if (_ctx.prev = 69, _ctx.prev = 70, !(_iteratorAbruptCompletion7 && null != _iterator7.return)) {
                        _ctx.next = 74;
                        break;
                    }
                    return _ctx.next = 74, _iteratorError7.return();
                case 74:
                    if (_ctx.prev = 74, !_didIteratorError7) {
                        _ctx.next = 77;
                        break;
                    }
                    throw _iteratorError7;
                case 77:
                    return _ctx.finish(74);
                case 78:
                    return _ctx.finish(69);
                case 79:
                    _iteratorAbruptCompletion8 = !1, _didIteratorError8 = !1, _ctx.prev = 80, _iterator8 = _asyncIterator(asyncIterable);
                case 82:
                    return _ctx.next = 84, _awaitAsyncGenerator(_iterator8.next());
                case 84:
                    if (!(_iteratorAbruptCompletion8 = !(_step8 = _ctx.sent).done)) {
                        _ctx.next = 89;
                        break;
                    }
                    y = _value8 = _step8.value;
                case 86:
                    _iteratorAbruptCompletion8 = !1, _ctx.next = 82;
                    break;
                case 89:
                    _ctx.next = 95;
                    break;
                case 91:
                    _ctx.prev = 91, _ctx.t3 = _ctx.catch(80), _didIteratorError8 = !0, _iteratorError8 = _ctx.t3;
                case 95:
                    if (_ctx.prev = 95, _ctx.prev = 96, !(_iteratorAbruptCompletion8 && null != _iterator8.return)) {
                        _ctx.next = 100;
                        break;
                    }
                    return _ctx.next = 100, _iteratorError8.return();
                case 100:
                    if (_ctx.prev = 100, !_didIteratorError8) {
                        _ctx.next = 103;
                        break;
                    }
                    throw _iteratorError8;
                case 103:
                    return _ctx.finish(100);
                case 104:
                    return _ctx.finish(95);
                case 105:
                    _iteratorAbruptCompletion9 = !1, _didIteratorError9 = !1, _ctx.prev = 106, _iterator9 = _asyncIterator(iterable);
                case 108:
                    return _ctx.next = 110, _awaitAsyncGenerator(_iterator9.next());
                case 110:
                    if (!(_iteratorAbruptCompletion9 = !(_step9 = _ctx.sent).done)) {
                        _ctx.next = 115;
                        break;
                    }
                    y = _value9 = _step9.value;
                case 112:
                    _iteratorAbruptCompletion9 = !1, _ctx.next = 108;
                    break;
                case 115:
                    _ctx.next = 121;
                    break;
                case 117:
                    _ctx.prev = 117, _ctx.t4 = _ctx.catch(106), _didIteratorError9 = !0, _iteratorError9 = _ctx.t4;
                case 121:
                    if (_ctx.prev = 121, _ctx.prev = 122, !(_iteratorAbruptCompletion9 && null != _iterator9.return)) {
                        _ctx.next = 126;
                        break;
                    }
                    return _ctx.next = 126, _iteratorError9.return();
                case 126:
                    if (_ctx.prev = 126, !_didIteratorError9) {
                        _ctx.next = 129;
                        break;
                    }
                    throw _iteratorError9;
                case 129:
                    return _ctx.finish(126);
                case 130:
                    return _ctx.finish(121);
                case 131:
                    _iteratorAbruptCompletion10 = !1, _didIteratorError10 = !1, _ctx.prev = 132, _iterator10 = _asyncIterator(iterableOfPromise);
                case 134:
                    return _ctx.next = 136, _awaitAsyncGenerator(_iterator10.next());
                case 136:
                    if (!(_iteratorAbruptCompletion10 = !(_step10 = _ctx.sent).done)) {
                        _ctx.next = 141;
                        break;
                    }
                    y = _value10 = _step10.value;
                case 138:
                    _iteratorAbruptCompletion10 = !1, _ctx.next = 134;
                    break;
                case 141:
                    _ctx.next = 147;
                    break;
                case 143:
                    _ctx.prev = 143, _ctx.t5 = _ctx.catch(132), _didIteratorError10 = !0, _iteratorError10 = _ctx.t5;
                case 147:
                    if (_ctx.prev = 147, _ctx.prev = 148, !(_iteratorAbruptCompletion10 && null != _iterator10.return)) {
                        _ctx.next = 152;
                        break;
                    }
                    return _ctx.next = 152, _iteratorError10.return();
                case 152:
                    if (_ctx.prev = 152, !_didIteratorError10) {
                        _ctx.next = 155;
                        break;
                    }
                    throw _iteratorError10;
                case 155:
                    return _ctx.finish(152);
                case 156:
                    return _ctx.finish(147);
                case 157:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ],
            [
                28,
                39,
                43,
                53
            ],
            [
                44,
                ,
                48,
                52
            ],
            [
                54,
                65,
                69,
                79
            ],
            [
                70,
                ,
                74,
                78
            ],
            [
                80,
                91,
                95,
                105
            ],
            [
                96,
                ,
                100,
                104
            ],
            [
                106,
                117,
                121,
                131
            ],
            [
                122,
                ,
                126,
                130
            ],
            [
                132,
                143,
                147,
                157
            ],
            [
                148,
                ,
                152,
                156
            ]
        ]);
    }))).apply(this, arguments);
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
