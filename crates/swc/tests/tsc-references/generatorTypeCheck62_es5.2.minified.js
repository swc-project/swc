import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
export function strategy(stratName, gen) {
    return function(state) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, next, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = !0, _didIteratorError = !1, _iteratorError = void 0, _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]), _iterator = gen(state)[Symbol.iterator](), _state.label = 2;
                case 2:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) return [
                        3,
                        5
                    ];
                    return (next = _step.value) && (next.lastStrategyApplied = stratName), [
                        4,
                        next
                    ];
                case 3:
                    _state.sent(), _state.label = 4;
                case 4:
                    return _iteratorNormalCompletion = !0, [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    return err = _state.sent(), _didIteratorError = !0, _iteratorError = err, [
                        3,
                        8
                    ];
                case 7:
                    try {
                        _iteratorNormalCompletion || null == _iterator.return || _iterator.return();
                    } finally{
                        if (_didIteratorError) throw _iteratorError;
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
    };
}
export var Nothing1 = strategy("Nothing", function(state) {
    return _ts_generator(this, function(_state) {
        return [
            2,
            state
        ];
    });
});
export var Nothing2 = strategy("Nothing", function(state) {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    state
                ];
            case 1:
                return _state.sent(), [
                    2
                ];
        }
    });
});
export var Nothing3 = strategy("Nothing", function(state) {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4
                ];
            case 1:
                return _state.sent(), [
                    2,
                    state
                ];
        }
    });
});
