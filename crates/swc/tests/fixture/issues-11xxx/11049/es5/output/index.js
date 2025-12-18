import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var MyClass = function MyClass(data) {
    "use strict";
    _class_call_check(this, MyClass);
    if (!_instanceof(data, Array)) throw new Error('Invalid instance');
    this.data = data;
};
function fetchPromise(idx) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            return resolve(idx);
        }, 10);
    });
}
function func1() {
    return _async_to_generator(function() {
        var arr, _arr, a, _arr_, b, d, instance;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    arr = [
                        1,
                        [
                            2,
                            3
                        ],
                        ,
                        4
                    ];
                    _arr = _sliced_to_array(arr, 4), a = _arr[0], _arr_ = _sliced_to_array(_arr[1], 2), b = _arr_[1], d = _arr[3];
                    instance = new MyClass([
                        a,
                        b,
                        d
                    ]);
                    return [
                        4,
                        fetchPromise(instance.data[0])
                    ];
                case 1:
                    a = _state.sent() || fetchPromise(0);
                    return [
                        4,
                        fetchPromise(instance.data[1])
                    ];
                case 2:
                    b = _state.sent() || fetchPromise(0);
                    return [
                        4,
                        fetchPromise(instance.data[2])
                    ];
                case 3:
                    d = _state.sent() || fetchPromise(0);
                    return [
                        2,
                        [
                            a,
                            b,
                            d
                        ]
                    ];
            }
        });
    })();
}
function main() {
    var res = func1();
    res.then(function(value) {
        return console.log(value);
    });
}
main();
