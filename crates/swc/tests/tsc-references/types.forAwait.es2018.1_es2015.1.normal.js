import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _async_to_generator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(asyncIterable), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
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
        {
            var _iteratorAbruptCompletion1 = false, _didIteratorError1 = false, _iteratorError1;
            try {
                for(var _iterator1 = _async_iterator(iterable), _step1; _iteratorAbruptCompletion1 = !(_step1 = yield _iterator1.next()).done; _iteratorAbruptCompletion1 = false){
                    let _value1 = _step1.value;
                    const x1 = _value1;
                }
            } catch (err1) {
                _didIteratorError1 = true;
                _iteratorError1 = err1;
            } finally{
                try {
                    if (_iteratorAbruptCompletion1 && _iterator1.return != null) {
                        yield _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion2 = false, _didIteratorError2 = false, _iteratorError2;
            try {
                for(var _iterator2 = _async_iterator(iterableOfPromise), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _iterator2.next()).done; _iteratorAbruptCompletion2 = false){
                    let _value2 = _step2.value;
                    const x2 = _value2;
                }
            } catch (err2) {
                _didIteratorError2 = true;
                _iteratorError2 = err2;
            } finally{
                try {
                    if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
                        yield _iterator2.return();
                    }
                } finally{
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion3 = false, _didIteratorError3 = false, _iteratorError3;
            try {
                for(var _iterator3 = _async_iterator(asyncIterable), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _iterator3.next()).done; _iteratorAbruptCompletion3 = false){
                    let _value3 = _step3.value;
                    y = _value3;
                }
            } catch (err3) {
                _didIteratorError3 = true;
                _iteratorError3 = err3;
            } finally{
                try {
                    if (_iteratorAbruptCompletion3 && _iterator3.return != null) {
                        yield _iterator3.return();
                    }
                } finally{
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion4 = false, _didIteratorError4 = false, _iteratorError4;
            try {
                for(var _iterator4 = _async_iterator(iterable), _step4; _iteratorAbruptCompletion4 = !(_step4 = yield _iterator4.next()).done; _iteratorAbruptCompletion4 = false){
                    let _value4 = _step4.value;
                    y = _value4;
                }
            } catch (err4) {
                _didIteratorError4 = true;
                _iteratorError4 = err4;
            } finally{
                try {
                    if (_iteratorAbruptCompletion4 && _iterator4.return != null) {
                        yield _iterator4.return();
                    }
                } finally{
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion5 = false, _didIteratorError5 = false, _iteratorError5;
            try {
                for(var _iterator5 = _async_iterator(iterableOfPromise), _step5; _iteratorAbruptCompletion5 = !(_step5 = yield _iterator5.next()).done; _iteratorAbruptCompletion5 = false){
                    let _value5 = _step5.value;
                    y = _value5;
                }
            } catch (err5) {
                _didIteratorError5 = true;
                _iteratorError5 = err5;
            } finally{
                try {
                    if (_iteratorAbruptCompletion5 && _iterator5.return != null) {
                        yield _iterator5.return();
                    }
                } finally{
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    });
    return _f1.apply(this, arguments);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(asyncIterable), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
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
        {
            var _iteratorAbruptCompletion1 = false, _didIteratorError1 = false, _iteratorError1;
            try {
                for(var _iterator1 = _async_iterator(iterable), _step1; _iteratorAbruptCompletion1 = !(_step1 = yield _await_async_generator(_iterator1.next())).done; _iteratorAbruptCompletion1 = false){
                    let _value1 = _step1.value;
                    const x1 = _value1;
                }
            } catch (err1) {
                _didIteratorError1 = true;
                _iteratorError1 = err1;
            } finally{
                try {
                    if (_iteratorAbruptCompletion1 && _iterator1.return != null) {
                        yield _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion2 = false, _didIteratorError2 = false, _iteratorError2;
            try {
                for(var _iterator2 = _async_iterator(iterableOfPromise), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _await_async_generator(_iterator2.next())).done; _iteratorAbruptCompletion2 = false){
                    let _value2 = _step2.value;
                    const x2 = _value2;
                }
            } catch (err2) {
                _didIteratorError2 = true;
                _iteratorError2 = err2;
            } finally{
                try {
                    if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
                        yield _iterator2.return();
                    }
                } finally{
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion3 = false, _didIteratorError3 = false, _iteratorError3;
            try {
                for(var _iterator3 = _async_iterator(asyncIterable), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _await_async_generator(_iterator3.next())).done; _iteratorAbruptCompletion3 = false){
                    let _value3 = _step3.value;
                    y = _value3;
                }
            } catch (err3) {
                _didIteratorError3 = true;
                _iteratorError3 = err3;
            } finally{
                try {
                    if (_iteratorAbruptCompletion3 && _iterator3.return != null) {
                        yield _iterator3.return();
                    }
                } finally{
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion4 = false, _didIteratorError4 = false, _iteratorError4;
            try {
                for(var _iterator4 = _async_iterator(iterable), _step4; _iteratorAbruptCompletion4 = !(_step4 = yield _await_async_generator(_iterator4.next())).done; _iteratorAbruptCompletion4 = false){
                    let _value4 = _step4.value;
                    y = _value4;
                }
            } catch (err4) {
                _didIteratorError4 = true;
                _iteratorError4 = err4;
            } finally{
                try {
                    if (_iteratorAbruptCompletion4 && _iterator4.return != null) {
                        yield _iterator4.return();
                    }
                } finally{
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion5 = false, _didIteratorError5 = false, _iteratorError5;
            try {
                for(var _iterator5 = _async_iterator(iterableOfPromise), _step5; _iteratorAbruptCompletion5 = !(_step5 = yield _await_async_generator(_iterator5.next())).done; _iteratorAbruptCompletion5 = false){
                    let _value5 = _step5.value;
                    y = _value5;
                }
            } catch (err5) {
                _didIteratorError5 = true;
                _iteratorError5 = err5;
            } finally{
                try {
                    if (_iteratorAbruptCompletion5 && _iterator5.return != null) {
                        yield _iterator5.return();
                    }
                } finally{
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    });
    return _f2.apply(this, arguments);
}
