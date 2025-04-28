//// [controlFlowIterationErrorsAsync.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var cond;
function len(s) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                s.length
            ];
        });
    })();
}
function f1() {
    return _async_to_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        len(x)
                    ];
                case 2:
                    x = _state.sent();
                    x;
                    return [
                        3,
                        1
                    ];
                case 3:
                    x;
                    return [
                        2
                    ];
            }
        });
    })();
}
function f2() {
    return _async_to_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    x;
                    return [
                        4,
                        len(x)
                    ];
                case 2:
                    x = _state.sent();
                    return [
                        3,
                        1
                    ];
                case 3:
                    x;
                    return [
                        2
                    ];
            }
        });
    })();
}
function g1() {
    return _async_to_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        foo(x)
                    ];
                case 2:
                    x = _state.sent();
                    x;
                    return [
                        3,
                        1
                    ];
                case 3:
                    x;
                    return [
                        2
                    ];
            }
        });
    })();
}
function g2() {
    return _async_to_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    x;
                    return [
                        4,
                        foo(x)
                    ];
                case 2:
                    x = _state.sent();
                    return [
                        3,
                        1
                    ];
                case 3:
                    x;
                    return [
                        2
                    ];
            }
        });
    })();
}
function asNumber(x) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                +x
            ];
        });
    })();
}
function h1() {
    return _async_to_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            x = "0";
            while(cond){
                x = +x + 1;
                x;
            }
            return [
                2
            ];
        });
    })();
}
function h2() {
    return _async_to_generator(function() {
        var x;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "0";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        asNumber(x)
                    ];
                case 2:
                    x = _state.sent() + 1;
                    x;
                    return [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function h3() {
    return _async_to_generator(function() {
        var x, y;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "0";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        asNumber(x)
                    ];
                case 2:
                    y = _state.sent();
                    x = y + 1;
                    x;
                    return [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
function h4() {
    return _async_to_generator(function() {
        var x, y;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    x = "0";
                    _state.label = 1;
                case 1:
                    if (!cond) return [
                        3,
                        3
                    ];
                    x;
                    return [
                        4,
                        asNumber(x)
                    ];
                case 2:
                    y = _state.sent();
                    x = y + 1;
                    x;
                    return [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
// repro #51115
function get_things(_) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                [
                    0
                ]
            ];
        });
    })();
}
function foobar() {
    return _async_to_generator(function() {
        var before, i, results;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    before = undefined;
                    i = 0;
                    _state.label = 1;
                case 1:
                    if (!(i < 2)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        get_things(before)
                    ];
                case 2:
                    results = _state.sent();
                    before = results[0];
                    _state.label = 3;
                case 3:
                    i++;
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
(function() {
    return _async_to_generator(function() {
        var bar, baz;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    bar = undefined;
                    _state.label = 1;
                case 1:
                    return [
                        4,
                        foox(bar)
                    ];
                case 2:
                    baz = _state.sent();
                    bar = baz;
                    _state.label = 3;
                case 3:
                    if (bar) return [
                        3,
                        1
                    ];
                    _state.label = 4;
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
});
function myFunc() {
    return _async_to_generator(function() {
        var lastId, entities;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    lastId = undefined;
                    _state.label = 1;
                case 1:
                    if (!true) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        myQuery({
                            lastId: lastId
                        })
                    ];
                case 2:
                    entities = _state.sent().entities;
                    lastId = entities[entities.length - 1];
                    return [
                        3,
                        1
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
}
