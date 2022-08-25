// @target: esnext
// @strict: true
// @noEmit: true
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
// spread iterable
_to_consumable_array(g1); // error
_to_consumable_array(g2); // ok
// binding pattern over iterable
var _g1 = _sliced_to_array(g1, 1), x1 = _g1[0]; // error
var _g2 = _sliced_to_array(g2, 1), x2 = _g2[0]; // ok
// binding rest pattern over iterable
var _g11 = _to_array(g1), y1 = _g11.slice(0); // error
var _g21 = _to_array(g2), y2 = _g21.slice(0); // ok
var ref;
// assignment pattern over iterable
ref = _sliced_to_array(g1, 1), _ = ref[0], ref; // error
var ref1;
ref1 = _sliced_to_array(g2, 1), _ = ref1[0], ref1; // ok
var ref2;
// assignment rest pattern over iterable
ref2 = _to_array(g1), _ = ref2.slice(0), ref2; // error
var ref3;
ref3 = _to_array(g2), _ = ref3.slice(0), ref3; // ok
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
    _asyncfn = _async_to_generator(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, err1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, err2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, err3;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator(g1);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        5
                    ];
                    _value = _step.value;
                    _ = _value;
                    _state.label = 4;
                case 4:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        12
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        12
                    ];
                case 7:
                    _state.trys.push([
                        7,
                        ,
                        10,
                        11
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    return [
                        3,
                        11
                    ];
                case 10:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 11:
                    return [
                        7
                    ];
                case 12:
                    _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                    _state.label = 13;
                case 13:
                    _state.trys.push([
                        13,
                        18,
                        19,
                        24
                    ]);
                    _iterator1 = _async_iterator(g2);
                    _state.label = 14;
                case 14:
                    return [
                        4,
                        _iterator1.next()
                    ];
                case 15:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _state.sent()).done)) return [
                        3,
                        17
                    ];
                    _value1 = _step1.value;
                    _ = _value1;
                    _state.label = 16;
                case 16:
                    _iteratorAbruptCompletion1 = false;
                    return [
                        3,
                        14
                    ];
                case 17:
                    return [
                        3,
                        24
                    ];
                case 18:
                    err1 = _state.sent();
                    _didIteratorError1 = true;
                    _iteratorError1 = err1;
                    return [
                        3,
                        24
                    ];
                case 19:
                    _state.trys.push([
                        19,
                        ,
                        22,
                        23
                    ]);
                    if (!(_iteratorAbruptCompletion1 && _iterator1.return != null)) return [
                        3,
                        21
                    ];
                    return [
                        4,
                        _iterator1.return()
                    ];
                case 20:
                    _state.sent();
                    _state.label = 21;
                case 21:
                    return [
                        3,
                        23
                    ];
                case 22:
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                    return [
                        7
                    ];
                case 23:
                    return [
                        7
                    ];
                case 24:
                    _iteratorAbruptCompletion2 = false, _didIteratorError2 = false;
                    _state.label = 25;
                case 25:
                    _state.trys.push([
                        25,
                        30,
                        31,
                        36
                    ]);
                    _iterator2 = _async_iterator(g4);
                    _state.label = 26;
                case 26:
                    return [
                        4,
                        _iterator2.next()
                    ];
                case 27:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _state.sent()).done)) return [
                        3,
                        29
                    ];
                    _value2 = _step2.value;
                    _ = _value2;
                    _state.label = 28;
                case 28:
                    _iteratorAbruptCompletion2 = false;
                    return [
                        3,
                        26
                    ];
                case 29:
                    return [
                        3,
                        36
                    ];
                case 30:
                    err2 = _state.sent();
                    _didIteratorError2 = true;
                    _iteratorError2 = err2;
                    return [
                        3,
                        36
                    ];
                case 31:
                    _state.trys.push([
                        31,
                        ,
                        34,
                        35
                    ]);
                    if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) return [
                        3,
                        33
                    ];
                    return [
                        4,
                        _iterator2.return()
                    ];
                case 32:
                    _state.sent();
                    _state.label = 33;
                case 33:
                    return [
                        3,
                        35
                    ];
                case 34:
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                    return [
                        7
                    ];
                case 35:
                    return [
                        7
                    ];
                case 36:
                    _iteratorAbruptCompletion3 = false, _didIteratorError3 = false;
                    _state.label = 37;
                case 37:
                    _state.trys.push([
                        37,
                        42,
                        43,
                        48
                    ]);
                    _iterator3 = _async_iterator(g5);
                    _state.label = 38;
                case 38:
                    return [
                        4,
                        _iterator3.next()
                    ];
                case 39:
                    if (!(_iteratorAbruptCompletion3 = !(_step3 = _state.sent()).done)) return [
                        3,
                        41
                    ];
                    _value3 = _step3.value;
                    _ = _value3;
                    _state.label = 40;
                case 40:
                    _iteratorAbruptCompletion3 = false;
                    return [
                        3,
                        38
                    ];
                case 41:
                    return [
                        3,
                        48
                    ];
                case 42:
                    err3 = _state.sent();
                    _didIteratorError3 = true;
                    _iteratorError3 = err3;
                    return [
                        3,
                        48
                    ];
                case 43:
                    _state.trys.push([
                        43,
                        ,
                        46,
                        47
                    ]);
                    if (!(_iteratorAbruptCompletion3 && _iterator3.return != null)) return [
                        3,
                        45
                    ];
                    return [
                        4,
                        _iterator3.return()
                    ];
                case 44:
                    _state.sent();
                    _state.label = 45;
                case 45:
                    return [
                        3,
                        47
                    ];
                case 46:
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                    return [
                        7
                    ];
                case 47:
                    return [
                        7
                    ];
                case 48:
                    return [
                        2
                    ];
            }
        });
    });
    return _asyncfn.apply(this, arguments);
}
function f1() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                // yield* over iterable
                return [
                    5,
                    _ts_values(g1)
                ];
            case 1:
                _state.sent(); // error
                return [
                    5,
                    _ts_values(g3)
                ];
            case 2:
                _state.sent(); // ok
                return [
                    2
                ];
        }
    });
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // yield* over iterable
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator(g1), _await_async_generator))
                    ];
                case 1:
                    _state.sent(); // error
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator(g3), _await_async_generator))
                    ];
                case 2:
                    _state.sent(); // ok
                    // yield* over asynciterable
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator(g4), _await_async_generator))
                    ];
                case 3:
                    _state.sent(); // error
                    return [
                        5,
                        _ts_values(_async_generator_delegate(_async_iterator(g6), _await_async_generator))
                    ];
                case 4:
                    _state.sent(); // ok
                    return [
                        2
                    ];
            }
        });
    });
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _async_to_generator(function() {
        var syncGenerator, o, _tmp, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    syncGenerator = function syncGenerator() {
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        1
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        4,
                                        2
                                    ];
                                case 2:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _tmp = {};
                    o = _define_property(_tmp, Symbol.asyncIterator, syncGenerator);
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator(o);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        5
                    ];
                    _value = _step.value;
                    x = _value;
                    _state.label = 4;
                case 4:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        12
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        12
                    ];
                case 7:
                    _state.trys.push([
                        7,
                        ,
                        10,
                        11
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    return [
                        3,
                        11
                    ];
                case 10:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 11:
                    return [
                        7
                    ];
                case 12:
                    return [
                        2
                    ];
            }
        });
    });
    return _f3.apply(this, arguments);
}
