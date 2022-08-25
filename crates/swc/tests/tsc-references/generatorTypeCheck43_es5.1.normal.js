//@target: ES6
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function g() {
    var x, _tmp, _tmp1;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _tmp1 = {};
                _tmp = [
                    _tmp1
                ];
                return [
                    4,
                    0
                ];
            case 1:
                x = _define_property.apply(void 0, _tmp.concat(_state.sent(), function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                }));
                return [
                    2
                ];
        }
    });
}
