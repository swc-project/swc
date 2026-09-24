//// [file1.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
async function f1() {
    let y;
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(y), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const x = _value;
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
//// [file2.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
async function f2() {
    let x, y;
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(y), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                x = _value;
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
//// [file3.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f3() {
    return _wrap_async_generator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _await_async_generator(_iterator.return());
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    })();
}
//// [file4.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f4() {
    return _wrap_async_generator(function*() {
        let x, y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    x = _value;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _await_async_generator(_iterator.return());
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    })();
}
//// [file5.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
// https://github.com/Microsoft/TypeScript/issues/21363
async function f5() {
    let y;
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            outer: for(var _iterator = _async_iterator(y), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const x = _value;
                continue outer;
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
//// [file6.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
// https://github.com/Microsoft/TypeScript/issues/21363
function f6() {
    return _wrap_async_generator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                outer: for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const x = _value;
                    continue outer;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _await_async_generator(_iterator.return());
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    })();
}
//// [file7.ts]
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
// https://github.com/microsoft/TypeScript/issues/36166
function f7() {
    return _wrap_async_generator(function*() {
        let y;
        for(;;){
            {
                var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                try {
                    for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
                        let _value = _step.value;
                        const x = _value;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (_iteratorAbruptCompletion && _iterator.return != null) {
                            yield _await_async_generator(_iterator.return());
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    })();
}
