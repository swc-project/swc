import regeneratorRuntime from "regenerator-runtime";
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
function _f() {
    return (_f = (function(fn) {
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
        var y, z, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, _iteratorNormalCompletion, _didIteratorError4, _iteratorError4, _iterator4, _step4, x1, _iteratorNormalCompletion1, _didIteratorError5, _iteratorError5, _iterator5, _step5;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 3, _iterator = _asyncIterator({
                    });
                case 5:
                    return _ctx.next = 7, _iterator.next();
                case 7:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 12;
                        break;
                    }
                    x = _value = _step.value;
                case 9:
                    _iteratorAbruptCompletion = !1, _ctx.next = 5;
                    break;
                case 12:
                    _ctx.next = 18;
                    break;
                case 14:
                    _ctx.prev = 14, _ctx.t0 = _ctx.catch(3), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 18:
                    if (_ctx.prev = 18, _ctx.prev = 19, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 23;
                        break;
                    }
                    return _ctx.next = 23, _iteratorError.return();
                case 23:
                    if (_ctx.prev = 23, !_didIteratorError) {
                        _ctx.next = 26;
                        break;
                    }
                    throw _iteratorError;
                case 26:
                    return _ctx.finish(23);
                case 27:
                    return _ctx.finish(18);
                case 28:
                    _iteratorAbruptCompletion1 = !1, _didIteratorError1 = !1, _ctx.prev = 29, _iterator1 = _asyncIterator({
                    });
                case 31:
                    return _ctx.next = 33, _iterator1.next();
                case 33:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _ctx.sent).done)) {
                        _ctx.next = 38;
                        break;
                    }
                    y = _value1 = _step1.value;
                case 35:
                    _iteratorAbruptCompletion1 = !1, _ctx.next = 31;
                    break;
                case 38:
                    _ctx.next = 44;
                    break;
                case 40:
                    _ctx.prev = 40, _ctx.t1 = _ctx.catch(29), _didIteratorError1 = !0, _iteratorError1 = _ctx.t1;
                case 44:
                    if (_ctx.prev = 44, _ctx.prev = 45, !(_iteratorAbruptCompletion1 && null != _iterator1.return)) {
                        _ctx.next = 49;
                        break;
                    }
                    return _ctx.next = 49, _iteratorError1.return();
                case 49:
                    if (_ctx.prev = 49, !_didIteratorError1) {
                        _ctx.next = 52;
                        break;
                    }
                    throw _iteratorError1;
                case 52:
                    return _ctx.finish(49);
                case 53:
                    return _ctx.finish(44);
                case 54:
                    _iteratorAbruptCompletion2 = !1, _didIteratorError2 = !1, _ctx.prev = 55, _iterator2 = _asyncIterator(asyncIterable);
                case 57:
                    return _ctx.next = 59, _iterator2.next();
                case 59:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 64;
                        break;
                    }
                    z = _value2 = _step2.value;
                case 61:
                    _iteratorAbruptCompletion2 = !1, _ctx.next = 57;
                    break;
                case 64:
                    _ctx.next = 70;
                    break;
                case 66:
                    _ctx.prev = 66, _ctx.t2 = _ctx.catch(55), _didIteratorError2 = !0, _iteratorError2 = _ctx.t2;
                case 70:
                    if (_ctx.prev = 70, _ctx.prev = 71, !(_iteratorAbruptCompletion2 && null != _iterator2.return)) {
                        _ctx.next = 75;
                        break;
                    }
                    return _ctx.next = 75, _iteratorError2.return();
                case 75:
                    if (_ctx.prev = 75, !_didIteratorError2) {
                        _ctx.next = 78;
                        break;
                    }
                    throw _iteratorError2;
                case 78:
                    return _ctx.finish(75);
                case 79:
                    return _ctx.finish(70);
                case 80:
                    _iteratorAbruptCompletion3 = !1, _didIteratorError3 = !1, _ctx.prev = 81, _iterator3 = _asyncIterator(iterable);
                case 83:
                    return _ctx.next = 85, _iterator3.next();
                case 85:
                    if (!(_iteratorAbruptCompletion3 = !(_step3 = _ctx.sent).done)) {
                        _ctx.next = 90;
                        break;
                    }
                    z = _value3 = _step3.value;
                case 87:
                    _iteratorAbruptCompletion3 = !1, _ctx.next = 83;
                    break;
                case 90:
                    _ctx.next = 96;
                    break;
                case 92:
                    _ctx.prev = 92, _ctx.t3 = _ctx.catch(81), _didIteratorError3 = !0, _iteratorError3 = _ctx.t3;
                case 96:
                    if (_ctx.prev = 96, _ctx.prev = 97, !(_iteratorAbruptCompletion3 && null != _iterator3.return)) {
                        _ctx.next = 101;
                        break;
                    }
                    return _ctx.next = 101, _iteratorError3.return();
                case 101:
                    if (_ctx.prev = 101, !_didIteratorError3) {
                        _ctx.next = 104;
                        break;
                    }
                    throw _iteratorError3;
                case 104:
                    return _ctx.finish(101);
                case 105:
                    return _ctx.finish(96);
                case 106:
                    for(_iteratorNormalCompletion = !0, _didIteratorError4 = !1, _iteratorError4 = void 0, _ctx.prev = 107, _iterator4 = asyncIterable[Symbol.iterator](); !(_iteratorNormalCompletion = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion = !0)x1 = _step4.value;
                    _ctx.next = 115;
                    break;
                case 111:
                    _ctx.prev = 111, _ctx.t4 = _ctx.catch(107), _didIteratorError4 = !0, _iteratorError4 = _ctx.t4;
                case 115:
                    _ctx.prev = 115, _ctx.prev = 116, _iteratorNormalCompletion || null == _iterator4.return || _iterator4.return();
                case 118:
                    if (_ctx.prev = 118, !_didIteratorError4) {
                        _ctx.next = 121;
                        break;
                    }
                    throw _iteratorError4;
                case 121:
                    return _ctx.finish(118);
                case 122:
                    return _ctx.finish(115);
                case 123:
                    for(_iteratorNormalCompletion1 = !0, _didIteratorError5 = !1, _iteratorError5 = void 0, _ctx.prev = 124, _iterator5 = asyncIterable[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion1 = !0)y = _step5.value;
                    _ctx.next = 132;
                    break;
                case 128:
                    _ctx.prev = 128, _ctx.t5 = _ctx.catch(124), _didIteratorError5 = !0, _iteratorError5 = _ctx.t5;
                case 132:
                    _ctx.prev = 132, _ctx.prev = 133, _iteratorNormalCompletion1 || null == _iterator5.return || _iterator5.return();
                case 135:
                    if (_ctx.prev = 135, !_didIteratorError5) {
                        _ctx.next = 138;
                        break;
                    }
                    throw _iteratorError5;
                case 138:
                    return _ctx.finish(135);
                case 139:
                    return _ctx.finish(132);
                case 140:
                case "end":
                    return _ctx.stop();
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
            ],
            [
                29,
                40,
                44,
                54
            ],
            [
                45,
                ,
                49,
                53
            ],
            [
                55,
                66,
                70,
                80
            ],
            [
                71,
                ,
                75,
                79
            ],
            [
                81,
                92,
                96,
                106
            ],
            [
                97,
                ,
                101,
                105
            ],
            [
                107,
                111,
                115,
                123
            ],
            [
                116,
                ,
                118,
                122
            ],
            [
                124,
                128,
                132,
                140
            ],
            [
                133,
                ,
                135,
                139
            ]
        ]);
    }))).apply(this, arguments);
}
