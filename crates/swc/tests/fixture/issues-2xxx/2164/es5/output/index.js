import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(function() {
        var key;
        return _ts_generator(this, function(_state) {
            for(var key in {});
            return [
                2
            ];
        });
    });
    return _fn.apply(this, arguments);
}
