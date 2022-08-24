// @target: es6
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    var v, _tmp, _tmp1;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _tmp1 = {};
                _tmp = [
                    _tmp1
                ];
                return [
                    4
                ];
            case 1:
                v = _define_property.apply(void 0, _tmp.concat(_state.sent(), foo));
                return [
                    2
                ];
        }
    });
}
