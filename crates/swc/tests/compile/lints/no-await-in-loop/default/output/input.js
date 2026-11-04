var _async_iterator = require("@swc/helpers/_/_async_iterator");
var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!baz) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        bar
                    ];
                case 1:
                    _state.sent();
                    return [
                        3,
                        0
                    ];
                case 2:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        foo()
                    ];
                case 1:
                    if (!_state.sent()) return [
                        3,
                        2
                    ];
                    return [
                        3,
                        0
                    ];
                case 2:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, err;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!baz) return [
                        3,
                        13
                    ];
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        12
                    ]);
                    _iterator = _async_iterator._(xs);
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
                        3,
                        0
                    ];
                case 13:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, bar1, err;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = baz[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    bar1 = _step.value;
                    return [
                        4,
                        bar1
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        8
                    ];
                case 7:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, bar1, err;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = baz[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    bar1 = _step.value;
                    return [
                        4,
                        bar1
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        8
                    ];
                case 7:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _tmp, _tmp1, _tmp2, _i, bar1;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    _tmp = baz;
                    _tmp1 = [];
                    for(_tmp2 in _tmp)_tmp1.push(_tmp2);
                    _i = 0;
                    _state.label = 1;
                case 1:
                    if (!(_i < _tmp1.length)) return [
                        3,
                        4
                    ];
                    _tmp2 = _tmp1[_i];
                    if (!(_tmp2 in _tmp)) return [
                        3,
                        3
                    ];
                    bar1 = _tmp2;
                    return [
                        4,
                        bar1
                    ];
                case 2:
                    _state.sent();
                    _state.label = 3;
                case 3:
                    _i++;
                    return [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var i;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(i < n)) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        bar
                    ];
                case 1:
                    _state.sent();
                    _state.label = 2;
                case 2:
                    i++;
                    return [
                        3,
                        0
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var i;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        foo(i)
                    ];
                case 1:
                    if (!_state.sent()) return [
                        3,
                        3
                    ];
                    _state.label = 2;
                case 2:
                    i++;
                    return [
                        3,
                        0
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var i;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(i < n)) return [
                        3,
                        3
                    ];
                    _state.label = 1;
                case 1:
                    return [
                        4,
                        bar
                    ];
                case 2:
                    i = _state.sent();
                    return [
                        3,
                        0
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        bar
                    ];
                case 1:
                    _state.sent();
                    _state.label = 2;
                case 2:
                    if (baz) return [
                        3,
                        0
                    ];
                    _state.label = 3;
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        bar
                    ];
                case 1:
                    if (_state.sent()) return [
                        3,
                        0
                    ];
                    _state.label = 2;
                case 2:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!true) return [
                        3,
                        3
                    ];
                    if (!bar) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        bar
                    ];
                case 1:
                    foo.apply(void 0, [
                        _state.sent()
                    ]);
                    _state.label = 2;
                case 2:
                    return [
                        3,
                        0
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _tmp, _;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    _tmp = xyz;
                    if (_tmp) return [
                        3,
                        2
                    ];
                    _ = 5;
                    return [
                        4,
                        x
                    ];
                case 1:
                    _tmp = _ > _state.sent();
                    _state.label = 2;
                case 2:
                    if (!_tmp) return [
                        3,
                        3
                    ];
                    return [
                        3,
                        0
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x1, err;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        8,
                        9,
                        14
                    ]);
                    _iterator = _async_iterator._(xs);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        7
                    ];
                    _value = _step.value;
                    x1 = _value;
                    _state.label = 4;
                case 4:
                    if (!1) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        f(x1)
                    ];
                case 5:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 6:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        2
                    ];
                case 7:
                    return [
                        3,
                        14
                    ];
                case 8:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        14
                    ];
                case 9:
                    _state.trys.push([
                        9,
                        ,
                        12,
                        13
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        11
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 10:
                    _state.sent();
                    _state.label = 11;
                case 11:
                    return [
                        3,
                        13
                    ];
                case 12:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 13:
                    return [
                        7
                    ];
                case 14:
                    return [
                        2
                    ];
            }
        });
    })();
}
// valid
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        bar
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _tmp, _tmp1, _tmp2, _i, bar1;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        baz
                    ];
                case 1:
                    _tmp = _state.sent();
                    _tmp1 = [];
                    for(_tmp2 in _tmp)_tmp1.push(_tmp2);
                    _i = 0;
                    _state.label = 2;
                case 2:
                    if (!(_i < _tmp1.length)) return [
                        3,
                        4
                    ];
                    _tmp2 = _tmp1[_i];
                    if (!(_tmp2 in _tmp)) return [
                        3,
                        3
                    ];
                    bar1 = _tmp2;
                    _state.label = 3;
                case 3:
                    _i++;
                    return [
                        3,
                        2
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, bar1, err;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    return [
                        4,
                        baz
                    ];
                case 2:
                    _iterator = _state.sent()[Symbol.iterator]();
                    _state.label = 3;
                case 3:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    bar1 = _step.value;
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        3
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        8
                    ];
                case 7:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, bar1, err;
        return _ts_generator._(this, function(_state) {
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
                    return [
                        4,
                        baz
                    ];
                case 2:
                    _iterator = _async_iterator._.apply(void 0, [
                        _state.sent()
                    ]);
                    _state.label = 3;
                case 3:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 4:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        6
                    ];
                    _value = _step.value;
                    bar1 = _value;
                    _state.label = 5;
                case 5:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        3
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
                        _iterator.return()
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
function foo() {
    return _async_to_generator._(function() {
        var foo;
        return _ts_generator._(this, function(_state) {
            while(true){
                foo = function foo() {
                    return _async_to_generator._(function() {
                        return _ts_generator._(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        bar
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    })();
                };
            }
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var i;
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        bar
                    ];
                case 1:
                    i = _state.sent();
                    _state.label = 2;
                case 2:
                    if (!(i < n)) return [
                        3,
                        4
                    ];
                    _state.label = 3;
                case 3:
                    i++;
                    return [
                        3,
                        2
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            do {}while (bar);
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var y;
        return _ts_generator._(this, function(_state) {
            while(true){
                y = function y() {
                    return _async_to_generator._(function() {
                        return _ts_generator._(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        bar
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    })();
                };
            }
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var y;
        return _ts_generator._(this, function(_state) {
            while(true){
                y = function y() {
                    return _async_to_generator._(function() {
                        return _ts_generator._(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        foo
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
            }
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var y;
        return _ts_generator._(this, function(_state) {
            while(true){
                y = function y() {
                    return _async_to_generator._(function() {
                        return _ts_generator._(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        foo
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    })();
                };
            }
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var Foo;
        return _ts_generator._(this, function(_state) {
            while(true){
                Foo = /*#__PURE__*/ function() {
                    "use strict";
                    function Foo() {
                        _class_call_check._(this, Foo);
                    }
                    _create_class._(Foo, [
                        {
                            key: "foo",
                            value: function foo() {
                                return _async_to_generator._(function() {
                                    return _ts_generator._(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    bar
                                                ];
                                            case 1:
                                                _state.sent();
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }
                        }
                    ]);
                    return Foo;
                }();
            }
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var Foo;
        return _ts_generator._(this, function(_state) {
            while(true){
                Foo = /*#__PURE__*/ function() {
                    "use strict";
                    function Foo() {
                        _class_call_check._(this, Foo);
                    }
                    _create_class._(Foo, [
                        {
                            key: "foo",
                            value: function foo() {
                                return _async_to_generator._(function() {
                                    return _ts_generator._(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    bar
                                                ];
                                            case 1:
                                                _state.sent();
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }
                        }
                    ]);
                    return Foo;
                }();
            }
            return [
                2
            ];
        });
    })();
}
function foo() {
    return _async_to_generator._(function() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x1, err;
        return _ts_generator._(this, function(_state) {
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
                    _iterator = _async_iterator._(xs);
                    _state.label = 2;
                case 2:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 3:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        6
                    ];
                    _value = _step.value;
                    x1 = _value;
                    return [
                        4,
                        f(x1)
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
                        _iterator.return()
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
