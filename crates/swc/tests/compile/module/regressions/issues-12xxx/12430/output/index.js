import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function nestedLabels(stream) {
    return _async_to_generator(function() {
        var visited, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, item, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    visited = [];
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator(stream);
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
                    item = _value;
                    if (item === 1) return [
                        3,
                        4
                    ];
                    if (item === 2) return [
                        3,
                        5
                    ];
                    visited.push(item);
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
                        2,
                        visited
                    ];
            }
        });
    })();
}
function singleLabel(stream) {
    return _async_to_generator(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, item, err;
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
                    _iterator = _async_iterator(stream);
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
                    item = _value;
                    if (item === 1) return [
                        3,
                        4
                    ];
                    if (item === 2) return [
                        3,
                        5
                    ];
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
    })();
}
function generatorLabels(stream) {
    return _wrap_async_generator(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, item, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        7,
                        8,
                        13
                    ]);
                    _iterator = _async_iterator(stream);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _await_async_generator(_iterator.next())
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        6
                    ];
                    _value = _step.value;
                    item = _value;
                    if (item === 1) return [
                        3,
                        5
                    ];
                    if (item === 2) return [
                        3,
                        5
                    ];
                    if (item === 3) return [
                        3,
                        5
                    ];
                    if (item === 4) return [
                        3,
                        6
                    ];
                    if (item === 5) return [
                        3,
                        6
                    ];
                    if (item === 6) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        item
                    ];
                case 4:
                    _state.sent();
                    _state.label = 5;
                case 5:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        2
                    ];
                case 6:
                    return [
                        3,
                        13
                    ];
                case 7:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        13
                    ];
                case 8:
                    _state.trys.push([
                        8,
                        ,
                        11,
                        12
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        10
                    ];
                    return [
                        4,
                        _await_async_generator(_iterator.return())
                    ];
                case 9:
                    _state.sent();
                    _state.label = 10;
                case 10:
                    return [
                        3,
                        12
                    ];
                case 11:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 12:
                    return [
                        7
                    ];
                case 13:
                    return [
                        2
                    ];
            }
        });
    })();
}
