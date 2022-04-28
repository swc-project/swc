import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(f1);
// spread iterable
swcHelpers.toConsumableArray(g1); // error
swcHelpers.toConsumableArray(g2); // ok
// binding pattern over iterable
var _g1 = swcHelpers.slicedToArray(g1, 1), x1 = _g1[0]; // error
var _g2 = swcHelpers.slicedToArray(g2, 1), x2 = _g2[0]; // ok
// binding rest pattern over iterable
var _g11 = swcHelpers.toArray(g1), y1 = _g11.slice(0); // error
var _g21 = swcHelpers.toArray(g2), y2 = _g21.slice(0); // ok
var ref;
// assignment pattern over iterable
ref = swcHelpers.slicedToArray(g1, 1), _ = ref[0], ref; // error
var ref1;
ref1 = swcHelpers.slicedToArray(g2, 1), _ = ref1[0], ref1; // ok
var ref2;
// assignment rest pattern over iterable
ref2 = swcHelpers.toArray(g1), _ = ref2.slice(0), ref2; // error
var ref3;
ref3 = swcHelpers.toArray(g2), _ = ref3.slice(0), ref3; // ok
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    // for-of over iterable
    for(var _iterator = g1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        _ = _step.value;
        ; // error
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally{
    try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
        }
    } finally{
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}
var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
try {
    for(var _iterator1 = g2[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
        _ = _step1.value;
        ; // ok
    }
} catch (err) {
    _didIteratorError1 = true;
    _iteratorError1 = err;
} finally{
    try {
        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
            _iterator1.return();
        }
    } finally{
        if (_didIteratorError1) {
            throw _iteratorError1;
        }
    }
}
function asyncfn() {
    return _asyncfn.apply(this, arguments);
}
function _asyncfn() {
    _asyncfn = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _iteratorAbruptCompletion, _didIteratorError5, _iteratorError5, _iterator, _step, _value, _iteratorAbruptCompletion1, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value1, _iteratorAbruptCompletion2, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value2, _iteratorAbruptCompletion3, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value3;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = false, _didIteratorError5 = false;
                    _ctx.prev = 1;
                    _iterator = swcHelpers.asyncIterator(g1);
                case 3:
                    _ctx.next = 5;
                    return _iterator.next();
                case 5:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 10;
                        break;
                    }
                    {
                        _value = _step.value;
                        _ = _value;
                        ; // error
                    }
                case 7:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 3;
                    break;
                case 10:
                    _ctx.next = 16;
                    break;
                case 12:
                    _ctx.prev = 12;
                    _ctx.t0 = _ctx["catch"](1);
                    _didIteratorError5 = true;
                    _iteratorError5 = _ctx.t0;
                case 16:
                    _ctx.prev = 16;
                    _ctx.prev = 17;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 21;
                        break;
                    }
                    _ctx.next = 21;
                    return _iteratorError5.return();
                case 21:
                    _ctx.prev = 21;
                    if (!_didIteratorError5) {
                        _ctx.next = 24;
                        break;
                    }
                    throw _iteratorError5;
                case 24:
                    return _ctx.finish(21);
                case 25:
                    return _ctx.finish(16);
                case 26:
                    _iteratorAbruptCompletion1 = false, _didIteratorError2 = false;
                    _ctx.prev = 27;
                    _iterator2 = swcHelpers.asyncIterator(g2);
                case 29:
                    _ctx.next = 31;
                    return _iterator2.next();
                case 31:
                    if (!(_iteratorAbruptCompletion1 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 36;
                        break;
                    }
                    {
                        _value1 = _step2.value;
                        _ = _value1;
                        ; // ok
                    }
                case 33:
                    _iteratorAbruptCompletion1 = false;
                    _ctx.next = 29;
                    break;
                case 36:
                    _ctx.next = 42;
                    break;
                case 38:
                    _ctx.prev = 38;
                    _ctx.t1 = _ctx["catch"](27);
                    _didIteratorError2 = true;
                    _iteratorError2 = _ctx.t1;
                case 42:
                    _ctx.prev = 42;
                    _ctx.prev = 43;
                    if (!(_iteratorAbruptCompletion1 && _iterator2.return != null)) {
                        _ctx.next = 47;
                        break;
                    }
                    _ctx.next = 47;
                    return _iteratorError2.return();
                case 47:
                    _ctx.prev = 47;
                    if (!_didIteratorError2) {
                        _ctx.next = 50;
                        break;
                    }
                    throw _iteratorError2;
                case 50:
                    return _ctx.finish(47);
                case 51:
                    return _ctx.finish(42);
                case 52:
                    _iteratorAbruptCompletion2 = false, _didIteratorError3 = false;
                    _ctx.prev = 53;
                    _iterator3 = swcHelpers.asyncIterator(g4);
                case 55:
                    _ctx.next = 57;
                    return _iterator3.next();
                case 57:
                    if (!(_iteratorAbruptCompletion2 = !(_step3 = _ctx.sent).done)) {
                        _ctx.next = 62;
                        break;
                    }
                    {
                        _value2 = _step3.value;
                        _ = _value2;
                        ; // error
                    }
                case 59:
                    _iteratorAbruptCompletion2 = false;
                    _ctx.next = 55;
                    break;
                case 62:
                    _ctx.next = 68;
                    break;
                case 64:
                    _ctx.prev = 64;
                    _ctx.t2 = _ctx["catch"](53);
                    _didIteratorError3 = true;
                    _iteratorError3 = _ctx.t2;
                case 68:
                    _ctx.prev = 68;
                    _ctx.prev = 69;
                    if (!(_iteratorAbruptCompletion2 && _iterator3.return != null)) {
                        _ctx.next = 73;
                        break;
                    }
                    _ctx.next = 73;
                    return _iteratorError3.return();
                case 73:
                    _ctx.prev = 73;
                    if (!_didIteratorError3) {
                        _ctx.next = 76;
                        break;
                    }
                    throw _iteratorError3;
                case 76:
                    return _ctx.finish(73);
                case 77:
                    return _ctx.finish(68);
                case 78:
                    _iteratorAbruptCompletion3 = false, _didIteratorError4 = false;
                    _ctx.prev = 79;
                    _iterator4 = swcHelpers.asyncIterator(g5);
                case 81:
                    _ctx.next = 83;
                    return _iterator4.next();
                case 83:
                    if (!(_iteratorAbruptCompletion3 = !(_step4 = _ctx.sent).done)) {
                        _ctx.next = 88;
                        break;
                    }
                    {
                        _value3 = _step4.value;
                        _ = _value3;
                        ; // ok
                    }
                case 85:
                    _iteratorAbruptCompletion3 = false;
                    _ctx.next = 81;
                    break;
                case 88:
                    _ctx.next = 94;
                    break;
                case 90:
                    _ctx.prev = 90;
                    _ctx.t3 = _ctx["catch"](79);
                    _didIteratorError4 = true;
                    _iteratorError4 = _ctx.t3;
                case 94:
                    _ctx.prev = 94;
                    _ctx.prev = 95;
                    if (!(_iteratorAbruptCompletion3 && _iterator4.return != null)) {
                        _ctx.next = 99;
                        break;
                    }
                    _ctx.next = 99;
                    return _iteratorError4.return();
                case 99:
                    _ctx.prev = 99;
                    if (!_didIteratorError4) {
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
    }));
    return _asyncfn.apply(this, arguments);
}
function f1() {
    return regeneratorRuntime.wrap(function f1$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                // yield* over iterable
                return _ctx.delegateYield(g1, "t0", 1);
            case 1:
                return _ctx.delegateYield(g3, "t1", 2);
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    // yield* over iterable
                    return _ctx.delegateYield(swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g1), swcHelpers.awaitAsyncGenerator), "t0", 1);
                case 1:
                    return _ctx.delegateYield(swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g3), swcHelpers.awaitAsyncGenerator), "t1", 2);
                case 2:
                    // yield* over asynciterable
                    return _ctx.delegateYield(swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g4), swcHelpers.awaitAsyncGenerator), "t2", 3);
                case 3:
                    return _ctx.delegateYield(swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g6), swcHelpers.awaitAsyncGenerator), "t3", 4);
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var syncGenerator, o, _iteratorAbruptCompletion, _didIteratorError6, _iteratorError6, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    syncGenerator = regeneratorRuntime.mark(function syncGenerator() {
                        return regeneratorRuntime.wrap(function syncGenerator$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _ctx.next = 2;
                                    return 1;
                                case 2:
                                    _ctx.next = 4;
                                    return 2;
                                case 4:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, syncGenerator);
                    });
                    o = swcHelpers.defineProperty({}, Symbol.asyncIterator, syncGenerator);
                    _iteratorAbruptCompletion = false, _didIteratorError6 = false;
                    _ctx1.prev = 3;
                    _iterator = swcHelpers.asyncIterator(o);
                case 5:
                    _ctx1.next = 7;
                    return _iterator.next();
                case 7:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx1.sent).done)) {
                        _ctx1.next = 12;
                        break;
                    }
                    {
                        _value = _step.value;
                        x = _value;
                    }
                case 9:
                    _iteratorAbruptCompletion = false;
                    _ctx1.next = 5;
                    break;
                case 12:
                    _ctx1.next = 18;
                    break;
                case 14:
                    _ctx1.prev = 14;
                    _ctx1.t0 = _ctx1["catch"](3);
                    _didIteratorError6 = true;
                    _iteratorError6 = _ctx1.t0;
                case 18:
                    _ctx1.prev = 18;
                    _ctx1.prev = 19;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx1.next = 23;
                        break;
                    }
                    _ctx1.next = 23;
                    return _iteratorError6.return();
                case 23:
                    _ctx1.prev = 23;
                    if (!_didIteratorError6) {
                        _ctx1.next = 26;
                        break;
                    }
                    throw _iteratorError6;
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
    }));
    return _f3.apply(this, arguments);
}
