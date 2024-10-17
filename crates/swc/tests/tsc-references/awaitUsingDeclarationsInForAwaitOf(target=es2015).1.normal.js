//// [awaitUsingDeclarationsInForAwaitOf.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function*() {
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator([
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
                ]), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const _ = _value;
                    const env = {
                        stack: [],
                        error: void 0,
                        hasError: false
                    };
                    try {
                        const d1 = _ts_add_disposable_resource(env, _, true);
                        {}
                    } catch (e) {
                        env.error = e;
                        env.hasError = true;
                    } finally{
                        const result = _ts_dispose_resources(env);
                        if (result) yield result;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    });
    return _main.apply(this, arguments);
}
