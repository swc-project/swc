import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _ts_values from "@swc/helpers/src/_ts_values.mjs";
foo("", function() {
    var _tmp;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    5,
                    _ts_values(_define_property(_tmp = {}, Symbol.iterator, function() {
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
                                    return _state.sent(), [
                                        2
                                    ];
                            }
                        });
                    }))
                ];
            case 1:
                return _state.sent(), [
                    2
                ];
        }
    });
}, function(p) {});
