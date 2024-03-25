//// [awaitUsingDeclarationsInForOf.1.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function*() {
        for (const d1 of [
            {
                [Symbol.asyncDispose] () {
                    return _async_to_generator(function*() {})();
                }
            },
            {
                [Symbol.dispose] () {}
            },
            null,
            undefined
        ]){
            try {
                var _stack = [];
                {}
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack, _error, _hasError);
            }
        }
    });
    return _main.apply(this, arguments);
}
