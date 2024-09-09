import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import "reflect-metadata";
var v0 = /*#__PURE__*/ function() {
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
