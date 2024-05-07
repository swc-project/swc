var _async_iterator = require("@swc/helpers/_/_async_iterator");
var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _wrap_async_generator = require("@swc/helpers/_/_wrap_async_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function lol() {
    return _lol.apply(this, arguments);
}
function _lol() {
    _lol = _wrap_async_generator._(function() {
        return _ts_generator._(this, function(_state) {
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
    });
    return _lol.apply(this, arguments);
}
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator._(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, err;
        return _ts_generator._(this, function(_state) {
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
                    _iterator = _async_iterator._(lol());
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
                    console.log(x);
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
                    if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        _iterator["return"]()
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
    return _main.apply(this, arguments);
}
main();
