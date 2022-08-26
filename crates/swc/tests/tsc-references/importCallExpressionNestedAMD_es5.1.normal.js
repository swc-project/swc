// @module: amd
// @target: es6
// @skipLibCheck: true
// @lib: es6
// @filename: foo.ts
export default "./foo";
// @filename: index.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import("./foo")
                    ];
                case 1:
                    return [
                        4,
                        import(_state.sent().default)
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _foo.apply(this, arguments);
}
