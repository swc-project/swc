import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        _class_call_check(this, MyClass);
        this._value = null;
    }
    _create_class(MyClass, [
        {
            key: "fetchData",
            value: function fetchData() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            new Promise(function(resolve) {
                                setTimeout(function() {
                                    resolve('Data fetched');
                                }, 10);
                            })
                        ];
                    });
                })();
            }
        },
        {
            key: "fetchMoreData",
            value: function fetchMoreData() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2,
                            new Promise(function(resolve) {
                                setTimeout(function() {
                                    resolve('More data fetched');
                                }, 10);
                            })
                        ];
                    });
                })();
            }
        },
        {
            key: "initializeData",
            value: function initializeData() {
                return _async_to_generator(function() {
                    var _, _1, _2, _3;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _ = this;
                                return [
                                    4,
                                    this.fetchData()
                                ];
                            case 1:
                                _._value = _state.sent();
                                _1 = this;
                                _2 = _1._value;
                                _3 = ' ';
                                return [
                                    4,
                                    this.fetchMoreData()
                                ];
                            case 2:
                                _1._value = _2 + (_3 + _state.sent());
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "value",
            get: function get() {
                return this._value;
            },
            set: function set(newValue) {
                this._value = newValue;
            }
        }
    ]);
    return MyClass;
}();
function func1() {
    return _async_to_generator(function() {
        var myClass;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    myClass = new MyClass();
                    return [
                        4,
                        myClass.initializeData()
                    ];
                case 1:
                    _state.sent();
                    return [
                        2,
                        myClass.value
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
