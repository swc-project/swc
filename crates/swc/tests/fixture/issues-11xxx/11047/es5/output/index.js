import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var timeoutPromise = function timeoutPromise(timeout) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, timeout);
    });
};
var processArray = function processArray(array) {
    return _async_to_generator(function() {
        var _array, first, tmp, third, rest;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _array = _to_array(array), first = _array[0], tmp = _array[2], third = tmp === void 0 ? 'default' : tmp, rest = _array.slice(3);
                    if (!first || !third) {
                        return [
                            2
                        ];
                    }
                    return [
                        4,
                        timeoutPromise(10)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2,
                        {
                            first: first,
                            third: third,
                            rest: rest
                        }
                    ];
            }
        });
    })();
};
var func1 = function func1() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        processArray([
                            'value1',
                            'value2',
                            ,
                            'value4',
                            'value5',
                            'value6',
                            'value7'
                        ])
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    })();
};
var main = function main() {
    return _async_to_generator(function() {
        var res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        func1()
                    ];
                case 1:
                    res = _state.sent();
                    console.log(res);
                    return [
                        2
                    ];
            }
        });
    })();
};
main();
