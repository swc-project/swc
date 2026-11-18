import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function complexCompute(num) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve(num * 2);
                    }, 2000);
                })
            ];
        });
    })();
}
function func1() {
    return _async_to_generator(function() {
        var result, val, _tmp, temp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    val = 1; // initial assignment
                    _tmp = val;
                    if (_tmp) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        complexCompute(5)
                    ];
                case 1:
                    _tmp = _state.sent();
                    _state.label = 2;
                case 2:
                    val = _tmp;
                    if (!val) {
                        result = "No Value";
                        return [
                            3,
                            7
                        ];
                    }
                    if (!(val < 10)) return [
                        3,
                        6
                    ];
                    switch(val){
                        case 1:
                            return [
                                3,
                                3
                            ];
                        case 2:
                            return [
                                3,
                                4
                            ];
                    }
                    return [
                        3,
                        6
                    ];
                case 3:
                    result = "One";
                    return [
                        3,
                        7
                    ];
                case 4:
                    return [
                        4,
                        complexCompute(2)
                    ];
                case 5:
                    temp = _state.sent();
                    if (temp > val) {
                        result = "Two Modified";
                        return [
                            3,
                            7
                        ];
                    }
                    result = "Two";
                    return [
                        3,
                        7
                    ];
                case 6:
                    result = "Out of scope";
                    _state.label = 7;
                case 7:
                    return [
                        2,
                        result
                    ];
            }
        });
    })();
}
function main() {
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
}
main();
