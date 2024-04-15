//// [awaitUsingDeclarationsInForOf.1.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function() {
        var _i, _iter, d1, _usingCtx;
        return _ts_generator(this, function(_state) {
            for(_i = 0, _iter = [
                _define_property({}, Symbol.asyncDispose, function() {
                    return _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            return [
                                2
                            ];
                        });
                    })();
                }),
                _define_property({}, Symbol.dispose, function() {}),
                null,
                undefined
            ]; _i < _iter.length; _i++){
                d1 = _iter[_i];
                try {
                    _usingCtx = _using_ctx();
                    {}
                } catch (_) {
                    _usingCtx.e = _;
                } finally{
                    _usingCtx.d();
                }
            }
            return [
                2
            ];
        });
    });
    return _main.apply(this, arguments);
}
