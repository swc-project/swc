import regeneratorRuntime from "regenerator-runtime";
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
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
    return _arrayWithHoles(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || _nonIterableRest();
}
function _fn1() {
    return (_fn1 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn2() {
    return (_fn2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn3() {
    return (_fn3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn4() {
    return (_fn4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = y;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn5() {
    return (_fn5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = y.x;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn6() {
    return (_fn6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x, z;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = y.x, z = y.z;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn7() {
    return (_fn7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _x, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = void 0 === (_x = y.x) ? y : _x;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn8() {
    return (_fn8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = y.z;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn9() {
    return (_fn9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = y.z.x;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn10() {
    return (_fn10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var tmp, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = (void 0 === (tmp = y.z) ? y : tmp).x;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn11() {
    return (_fn11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = _extends({
                    }, y);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn12() {
    return (_fn12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _y, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = (_y = _slicedToArray(y, 1))[0];
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn13() {
    return (_fn13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _y, tmp, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = void 0 === (tmp = (_y = _slicedToArray(y, 1))[0]) ? y : tmp;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn14() {
    return (_fn14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _y, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = (_y = _slicedToArray(y, 2))[1];
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn15() {
    return (_fn15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _y, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = (_y = _toArray(y)).slice(0);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn16() {
    return (_fn16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _y, ref, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _y = _slicedToArray(y, 1), ref = _slicedToArray(_y[0], 1), x = ref[0];
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn17() {
    return (_fn17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _y, tmp, ref, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    tmp = (_y = _slicedToArray(y, 1))[0], ref = _slicedToArray(void 0 === tmp ? y : tmp, 1), x = ref[0];
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn18() {
    return (_fn18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(param) {
        var x, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = param.x;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn19() {
    return (_fn19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(param) {
        var _param, x, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    x = (_param = _slicedToArray(param, 1))[0];
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn20() {
    return (_fn20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn21() {
    return (_fn21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn22() {
    return (_fn22 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn23() {
    return (_fn23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                    } catch (e) {
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn24() {
    return (_fn24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                    } catch (e) {
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn25() {
    return (_fn25 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                    } catch (x) {
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn26() {
    return (_fn26 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x1, x1;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                    } catch (param) {
                        x1 = param.x;
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn27() {
    return (_fn27 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                    } finally{
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn28() {
    return (_fn28 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(; y;);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn29() {
    return (_fn29 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    do ;
                    while (y)
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn30() {
    return (_fn30 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(x = y;;);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn31() {
    return (_fn31 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(x = y.x;;);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn32() {
    return (_fn32 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(;;);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn33() {
    return (_fn33 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(x in y);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn34() {
    return (_fn34 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var z;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(z in y);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn35() {
    return (_fn35 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 1, _iterator = y[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)x = _step.value;
                    _ctx.next = 9;
                    break;
                case 5:
                    _ctx.prev = 5, _ctx.t0 = _ctx.catch(1), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 9:
                    _ctx.prev = 9, _ctx.prev = 10, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                case 12:
                    if (_ctx.prev = 12, !_didIteratorError) {
                        _ctx.next = 15;
                        break;
                    }
                    throw _iteratorError;
                case 15:
                    return _ctx.finish(12);
                case 16:
                    return _ctx.finish(9);
                case 17:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                5,
                9,
                17
            ],
            [
                10,
                ,
                12,
                16
            ]
        ]);
    }))).apply(this, arguments);
}
function _fn36() {
    return (_fn36 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 1, _iterator = y[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)x = _step.value.x;
                    _ctx.next = 9;
                    break;
                case 5:
                    _ctx.prev = 5, _ctx.t0 = _ctx.catch(1), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 9:
                    _ctx.prev = 9, _ctx.prev = 10, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                case 12:
                    if (_ctx.prev = 12, !_didIteratorError) {
                        _ctx.next = 15;
                        break;
                    }
                    throw _iteratorError;
                case 15:
                    return _ctx.finish(12);
                case 16:
                    return _ctx.finish(9);
                case 17:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                5,
                9,
                17
            ],
            [
                10,
                ,
                12,
                16
            ]
        ]);
    }))).apply(this, arguments);
}
function _fn37() {
    return (_fn37 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, z;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _ctx.prev = 1, _iterator = y[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = !0)z = _step.value;
                    _ctx.next = 9;
                    break;
                case 5:
                    _ctx.prev = 5, _ctx.t0 = _ctx.catch(1), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 9:
                    _ctx.prev = 9, _ctx.prev = 10, _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                case 12:
                    if (_ctx.prev = 12, !_didIteratorError) {
                        _ctx.next = 15;
                        break;
                    }
                    throw _iteratorError;
                case 15:
                    return _ctx.finish(12);
                case 16:
                    return _ctx.finish(9);
                case 17:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                5,
                9,
                17
            ],
            [
                10,
                ,
                12,
                16
            ]
        ]);
    }))).apply(this, arguments);
}
function _fn38() {
    return (_fn38 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    switch(y){
                        case y:
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn39() {
    return (_fn39 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("break", 2);
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _fn40() {
    return (_fn40 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(x) {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    try {
                    } catch (e) {
                    }
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
