//@target: ES6
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
function g() {
    var _tmp;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                _tmp = {};
                return [
                    5,
                    _ts_values(_define_property(_tmp, Symbol.iterator, function() {
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        function(x) {
                                            return x.length;
                                        }
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    }))
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
