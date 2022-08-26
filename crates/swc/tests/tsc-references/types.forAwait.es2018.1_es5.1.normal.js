// @target: es2018
// @lib: esnext
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
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, x1, err1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, x2, err2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, err3, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, err4, _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _value5, err5;
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
                    _iterator = _async_iterator(asyncIterable);
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
                    _iterator1 = _async_iterator(iterable);
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
                    x1 = _value1;
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
                    _iterator2 = _async_iterator(iterableOfPromise);
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
                    x2 = _value2;
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
                    _iterator3 = _async_iterator(asyncIterable);
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
                    y = _value3;
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
                    _iteratorAbruptCompletion4 = false, _didIteratorError4 = false;
                    _state.label = 49;
                case 49:
                    _state.trys.push([
                        49,
                        54,
                        55,
                        60
                    ]);
                    _iterator4 = _async_iterator(iterable);
                    _state.label = 50;
                case 50:
                    return [
                        4,
                        _iterator4.next()
                    ];
                case 51:
                    if (!(_iteratorAbruptCompletion4 = !(_step4 = _state.sent()).done)) return [
                        3,
                        53
                    ];
                    _value4 = _step4.value;
                    y = _value4;
                    _state.label = 52;
                case 52:
                    _iteratorAbruptCompletion4 = false;
                    return [
                        3,
                        50
                    ];
                case 53:
                    return [
                        3,
                        60
                    ];
                case 54:
                    err4 = _state.sent();
                    _didIteratorError4 = true;
                    _iteratorError4 = err4;
                    return [
                        3,
                        60
                    ];
                case 55:
                    _state.trys.push([
                        55,
                        ,
                        58,
                        59
                    ]);
                    if (!(_iteratorAbruptCompletion4 && _iterator4.return != null)) return [
                        3,
                        57
                    ];
                    return [
                        4,
                        _iterator4.return()
                    ];
                case 56:
                    _state.sent();
                    _state.label = 57;
                case 57:
                    return [
                        3,
                        59
                    ];
                case 58:
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                    return [
                        7
                    ];
                case 59:
                    return [
                        7
                    ];
                case 60:
                    _iteratorAbruptCompletion5 = false, _didIteratorError5 = false;
                    _state.label = 61;
                case 61:
                    _state.trys.push([
                        61,
                        66,
                        67,
                        72
                    ]);
                    _iterator5 = _async_iterator(iterableOfPromise);
                    _state.label = 62;
                case 62:
                    return [
                        4,
                        _iterator5.next()
                    ];
                case 63:
                    if (!(_iteratorAbruptCompletion5 = !(_step5 = _state.sent()).done)) return [
                        3,
                        65
                    ];
                    _value5 = _step5.value;
                    y = _value5;
                    _state.label = 64;
                case 64:
                    _iteratorAbruptCompletion5 = false;
                    return [
                        3,
                        62
                    ];
                case 65:
                    return [
                        3,
                        72
                    ];
                case 66:
                    err5 = _state.sent();
                    _didIteratorError5 = true;
                    _iteratorError5 = err5;
                    return [
                        3,
                        72
                    ];
                case 67:
                    _state.trys.push([
                        67,
                        ,
                        70,
                        71
                    ]);
                    if (!(_iteratorAbruptCompletion5 && _iterator5.return != null)) return [
                        3,
                        69
                    ];
                    return [
                        4,
                        _iterator5.return()
                    ];
                case 68:
                    _state.sent();
                    _state.label = 69;
                case 69:
                    return [
                        3,
                        71
                    ];
                case 70:
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                    return [
                        7
                    ];
                case 71:
                    return [
                        7
                    ];
                case 72:
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
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, err, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1, x1, err1, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, x2, err2, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, err3, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, err4, _iteratorAbruptCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _value5, err5;
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
                    _iterator = _async_iterator(asyncIterable);
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
                    _iterator1 = _async_iterator(iterable);
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
                    x1 = _value1;
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
                    _iterator2 = _async_iterator(iterableOfPromise);
                    _state.label = 26;
                case 26:
                    return [
                        4,
                        _await_async_generator(_iterator2.next())
                    ];
                case 27:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _state.sent()).done)) return [
                        3,
                        29
                    ];
                    _value2 = _step2.value;
                    x2 = _value2;
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
                    _iterator3 = _async_iterator(asyncIterable);
                    _state.label = 38;
                case 38:
                    return [
                        4,
                        _await_async_generator(_iterator3.next())
                    ];
                case 39:
                    if (!(_iteratorAbruptCompletion3 = !(_step3 = _state.sent()).done)) return [
                        3,
                        41
                    ];
                    _value3 = _step3.value;
                    y = _value3;
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
                    _iteratorAbruptCompletion4 = false, _didIteratorError4 = false;
                    _state.label = 49;
                case 49:
                    _state.trys.push([
                        49,
                        54,
                        55,
                        60
                    ]);
                    _iterator4 = _async_iterator(iterable);
                    _state.label = 50;
                case 50:
                    return [
                        4,
                        _await_async_generator(_iterator4.next())
                    ];
                case 51:
                    if (!(_iteratorAbruptCompletion4 = !(_step4 = _state.sent()).done)) return [
                        3,
                        53
                    ];
                    _value4 = _step4.value;
                    y = _value4;
                    _state.label = 52;
                case 52:
                    _iteratorAbruptCompletion4 = false;
                    return [
                        3,
                        50
                    ];
                case 53:
                    return [
                        3,
                        60
                    ];
                case 54:
                    err4 = _state.sent();
                    _didIteratorError4 = true;
                    _iteratorError4 = err4;
                    return [
                        3,
                        60
                    ];
                case 55:
                    _state.trys.push([
                        55,
                        ,
                        58,
                        59
                    ]);
                    if (!(_iteratorAbruptCompletion4 && _iterator4.return != null)) return [
                        3,
                        57
                    ];
                    return [
                        4,
                        _iterator4.return()
                    ];
                case 56:
                    _state.sent();
                    _state.label = 57;
                case 57:
                    return [
                        3,
                        59
                    ];
                case 58:
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                    return [
                        7
                    ];
                case 59:
                    return [
                        7
                    ];
                case 60:
                    _iteratorAbruptCompletion5 = false, _didIteratorError5 = false;
                    _state.label = 61;
                case 61:
                    _state.trys.push([
                        61,
                        66,
                        67,
                        72
                    ]);
                    _iterator5 = _async_iterator(iterableOfPromise);
                    _state.label = 62;
                case 62:
                    return [
                        4,
                        _await_async_generator(_iterator5.next())
                    ];
                case 63:
                    if (!(_iteratorAbruptCompletion5 = !(_step5 = _state.sent()).done)) return [
                        3,
                        65
                    ];
                    _value5 = _step5.value;
                    y = _value5;
                    _state.label = 64;
                case 64:
                    _iteratorAbruptCompletion5 = false;
                    return [
                        3,
                        62
                    ];
                case 65:
                    return [
                        3,
                        72
                    ];
                case 66:
                    err5 = _state.sent();
                    _didIteratorError5 = true;
                    _iteratorError5 = err5;
                    return [
                        3,
                        72
                    ];
                case 67:
                    _state.trys.push([
                        67,
                        ,
                        70,
                        71
                    ]);
                    if (!(_iteratorAbruptCompletion5 && _iterator5.return != null)) return [
                        3,
                        69
                    ];
                    return [
                        4,
                        _iterator5.return()
                    ];
                case 68:
                    _state.sent();
                    _state.label = 69;
                case 69:
                    return [
                        3,
                        71
                    ];
                case 70:
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                    return [
                        7
                    ];
                case 71:
                    return [
                        7
                    ];
                case 72:
                    return [
                        2
                    ];
            }
        });
    });
    return _f2.apply(this, arguments);
}
