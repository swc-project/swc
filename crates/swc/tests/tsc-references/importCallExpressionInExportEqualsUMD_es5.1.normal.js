// @module: umd
// @target: esnext
// @filename: something.ts
module.exports = 42;
export { };
// @filename: index.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
module.exports = /*#__PURE__*/ _async_to_generator(function() {
    var something;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    import("./something")
                ];
            case 1:
                something = _state.sent();
                return [
                    2
                ];
        }
    });
});
export { };
