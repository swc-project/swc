//// [usingDeclarationsInForAwaitOf.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
async function main() {
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator([
                {
                    [Symbol.dispose] () {}
                },
                null,
                undefined
            ]), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const _ = _value;
                const env = {
                    stack: [],
                    error: void 0,
                    hasError: false
                };
                try {
                    const d1 = _ts_add_disposable_resource(env, _, false);
                    {}
                } catch (e) {
                    env.error = e;
                    env.hasError = true;
                } finally{
                    _ts_dispose_resources(env);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (_iteratorAbruptCompletion && _iterator.return != null) {
                    await _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
