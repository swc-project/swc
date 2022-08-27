//// [file1.ts]
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _async_to_generator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const x = _value;
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
    return _f1.apply(this, arguments);
}
//// [file2.ts]
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _async_to_generator(function*() {
        let x, y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    x = _value;
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
    return _f2.apply(this, arguments);
}
//// [file3.ts]
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _wrap_async_generator(function*() {
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
    return _f3.apply(this, arguments);
}
//// [file4.ts]
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _wrap_async_generator(function*() {
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
    return _f4.apply(this, arguments);
}
//// [file5.ts]
// https://github.com/Microsoft/TypeScript/issues/21363
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function f5() {
    return _f5.apply(this, arguments);
}
function _f5() {
    _f5 = _async_to_generator(function*() {
        let y;
        outer: {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
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
    return _f5.apply(this, arguments);
}
//// [file6.ts]
// https://github.com/Microsoft/TypeScript/issues/21363
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f6() {
    return _f6.apply(this, arguments);
}
function _f6() {
    _f6 = _wrap_async_generator(function*() {
        let y;
        outer: {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
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
    return _f6.apply(this, arguments);
}
//// [file7.ts]
// https://github.com/microsoft/TypeScript/issues/36166
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f7() {
    return _f7.apply(this, arguments);
}
function _f7() {
    _f7 = _wrap_async_generator(function*() {
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
                            yield _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    });
    return _f7.apply(this, arguments);
}
