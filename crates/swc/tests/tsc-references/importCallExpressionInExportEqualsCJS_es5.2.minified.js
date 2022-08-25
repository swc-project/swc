module.exports = 42;
export { };
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
module.exports = _async_to_generator(function() {
    var something;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    import("./something")
                ];
            case 1:
                return something = _state.sent(), [
                    2
                ];
        }
    });
});
