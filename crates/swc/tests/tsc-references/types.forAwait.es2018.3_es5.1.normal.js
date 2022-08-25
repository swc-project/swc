// @target: es2018
// @lib: es5
// @noEmit: true
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _async_to_generator(function() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _tmp, _value, x, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _tmp1, _value1, err1;
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
                    _tmp = {};
                    _iterator = _async_iterator(_tmp);
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
                    _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                    _state.label = 13;
                case 13:
                    _state.trys.push([
                        13,
                        18,
                        19,
                        24
                    ]);
                    _tmp1 = {};
                    _iterator1 = _async_iterator(_tmp1);
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
                    y = _value1;
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
                    return [
                        2
                    ];
            }
        });
    });
    return _f1.apply(this, arguments);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _tmp, _value, x, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _tmp1, _value1, err1;
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
                    _tmp = {};
                    _iterator = _async_iterator(_tmp);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _await_async_generator(_iterator.next())
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
                    _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                    _state.label = 13;
                case 13:
                    _state.trys.push([
                        13,
                        18,
                        19,
                        24
                    ]);
                    _tmp1 = {};
                    _iterator1 = _async_iterator(_tmp1);
                    _state.label = 14;
                case 14:
                    return [
                        4,
                        _await_async_generator(_iterator1.next())
                    ];
                case 15:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _state.sent()).done)) return [
                        3,
                        17
                    ];
                    _value1 = _step1.value;
                    y = _value1;
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
                    return [
                        2
                    ];
            }
        });
    });
    return _f2.apply(this, arguments);
}
