import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import "reflect-metadata";
var v0 = function() {
    var _ref = _async_to_generator(function(v1) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                v1
            ];
        });
    });
    return function(v1) {
        return _ref.apply(this, arguments);
    };
}().constructor;
var res = v0(function() {
    return Reflect.get(v3, "a");
});
console.log(res);
