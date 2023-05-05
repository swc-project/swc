//// [foo.ts]
export default "./foo";
//// [index.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
