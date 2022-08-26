//@target: ES6
import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function g() {
    var _obj, _mutatorMap, _tmp, x, _tmp1;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _tmp = {};
                _mutatorMap = _tmp;
                _obj = {};
                return [
                    4,
                    0
                ];
            case 1:
                _ = _state.sent();
                return [
                    4,
                    0
                ];
            case 2:
                _tmp1 = {};
                _mutatorMap[_] = _mutatorMap[_state.sent()] || _tmp1;
                x = (_mutatorMap[yield 0].get = function() {
                    return 0;
                }, _define_enumerable_properties(_obj, _mutatorMap), _obj);
                return [
                    2
                ];
        }
    });
}
