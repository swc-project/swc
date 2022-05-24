import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import "reflect-metadata";
const v0 = function() {
    var _ref = _async_to_generator(function*(v1) {
        return v1;
    });
    return function(v1) {
        return _ref.apply(this, arguments);
    };
}().constructor;
const res = v0(()=>Reflect.get(v3, "a"));
console.log(res);
