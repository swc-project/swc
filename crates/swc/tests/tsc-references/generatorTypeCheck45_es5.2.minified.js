import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
foo("", function() {
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
}, function(p) {});
