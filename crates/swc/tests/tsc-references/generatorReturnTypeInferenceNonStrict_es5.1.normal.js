// @target: esnext
// @strictNullChecks: false
// @noImplicitReturns: true
// @noImplicitAny: true
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
function g000() {
    return _ts_generator(this, function(_state) {
        return [
            2
        ];
    });
}
// 'yield' iteration type inference
function g001() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function g002() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function g003() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                // NOTE: In strict mode, `[]` produces the type `never[]`.
                //       In non-strict mode, `[]` produces the type `undefined[]` which is implicitly any.
                return [
                    5,
                    _ts_values([])
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function g004() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    5,
                    _ts_values(iterableIterator)
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function g005() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    5,
                    _ts_values(generator)
                ];
            case 1:
                x = _state.sent();
                return [
                    2
                ];
        }
    });
}
function g006() {
    return _ts_generator(this, function(_state) {
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
}
function g007() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    never
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
// 'return' iteration type inference
function g102() {
    return _ts_generator(this, function(_state) {
        return [
            2,
            1
        ];
    });
}
function g103() {
    return _ts_generator(this, function(_state) {
        if (Math.random()) return [
            2,
            1
        ];
        return [
            2,
            2
        ];
    });
}
function g104() {
    return _ts_generator(this, function(_state) {
        return [
            2,
            never
        ];
    });
}
// 'next' iteration type inference
function g201() {
    var a;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                a = _state.sent();
                return [
                    2
                ];
        }
    });
}
function g202() {
    var a, b;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                a = _state.sent();
                return [
                    4,
                    2
                ];
            case 2:
                b = _state.sent();
                return [
                    2
                ];
        }
    });
}
function g203() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                x = f1.apply(void 0, [
                    _state.sent()
                ]);
                return [
                    2
                ];
        }
    });
}
function g204() {
    var x;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                x = f2.apply(void 0, [
                    _state.sent()
                ]);
                return [
                    2
                ];
        }
    });
}
// mixed iteration types inference
function g301() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function g302() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function g303() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                _state.sent();
                return [
                    2,
                    "a"
                ];
        }
    });
}
function g304() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                _state.sent();
                return [
                    2,
                    "a"
                ];
        }
    });
}
function g305() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                if (!Math.random()) return [
                    3,
                    2
                ];
                return [
                    4,
                    1
                ];
            case 1:
                _state.sent();
                _state.label = 2;
            case 2:
                return [
                    4,
                    2
                ];
            case 3:
                _state.sent();
                if (Math.random()) return [
                    2,
                    "a"
                ];
                return [
                    2,
                    "b"
                ];
        }
    });
}
function g306() {
    var a;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                a = _state.sent();
                return [
                    2,
                    true
                ];
        }
    });
}
function g307() {
    var a;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    0
                ];
            case 1:
                a = _state.sent();
                return [
                    2,
                    a
                ];
        }
    });
}
function g308(x) {
    var a;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    x
                ];
            case 1:
                a = _state.sent();
                return [
                    2,
                    a
                ];
        }
    });
}
function g309(x, y) {
    var a;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    x
                ];
            case 1:
                a = _state.sent();
                return [
                    2,
                    y
                ];
        }
    });
}
function g310() {
    var ref, tmp, a, tmp1, b;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                ref = _sliced_to_array.apply(void 0, [
                    _state.sent(),
                    2
                ]), tmp = ref[0], a = tmp === void 0 ? 1 : tmp, tmp1 = ref[1], b = tmp1 === void 0 ? 2 : tmp1;
                return [
                    2
                ];
        }
    });
}
function g311() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    5,
                    _ts_values(function() {
                        var y;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4
                                    ];
                                case 1:
                                    y = _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    }())
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
