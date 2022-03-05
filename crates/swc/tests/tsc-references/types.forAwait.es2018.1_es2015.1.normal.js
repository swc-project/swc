import * as swcHelpers from "@swc/helpers";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = swcHelpers.asyncToGenerator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = swcHelpers.asyncIterator(asyncIterable), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _iteratorError.return();
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
                for(var _iterator1 = swcHelpers.asyncIterator(iterable), _step1; _iteratorAbruptCompletion1 = !(_step1 = yield _iterator1.next()).done; _iteratorAbruptCompletion1 = false){
                    let _value = _step1.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion1 && _iterator1.return != null) {
                        yield _iteratorError1.return();
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
                for(var _iterator2 = swcHelpers.asyncIterator(iterableOfPromise), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _iterator2.next()).done; _iteratorAbruptCompletion2 = false){
                    let _value = _step2.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion2 && _iterator2.return != null) {
                        yield _iteratorError2.return();
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
                for(var _iterator3 = swcHelpers.asyncIterator(asyncIterable), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _iterator3.next()).done; _iteratorAbruptCompletion3 = false){
                    let _value = _step3.value;
                    y = _value;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion3 && _iterator3.return != null) {
                        yield _iteratorError3.return();
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
                for(var _iterator4 = swcHelpers.asyncIterator(iterable), _step4; _iteratorAbruptCompletion4 = !(_step4 = yield _iterator4.next()).done; _iteratorAbruptCompletion4 = false){
                    let _value = _step4.value;
                    y = _value;
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion4 && _iterator4.return != null) {
                        yield _iteratorError4.return();
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
                for(var _iterator5 = swcHelpers.asyncIterator(iterableOfPromise), _step5; _iteratorAbruptCompletion5 = !(_step5 = yield _iterator5.next()).done; _iteratorAbruptCompletion5 = false){
                    let _value = _step5.value;
                    y = _value;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion5 && _iterator5.return != null) {
                        yield _iteratorError5.return();
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
    _f2 = swcHelpers.wrapAsyncGenerator(function*() {
        let y;
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = swcHelpers.asyncIterator(asyncIterable), _step; _iteratorAbruptCompletion = !(_step = yield swcHelpers.awaitAsyncGenerator(_iterator.next())).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _iteratorError.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion6 = false, _didIteratorError6 = false, _iteratorError6;
            try {
                for(var _iterator6 = swcHelpers.asyncIterator(iterable), _step6; _iteratorAbruptCompletion6 = !(_step6 = yield swcHelpers.awaitAsyncGenerator(_iterator6.next())).done; _iteratorAbruptCompletion6 = false){
                    let _value = _step6.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion6 && _iterator6.return != null) {
                        yield _iteratorError6.return();
                    }
                } finally{
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion7 = false, _didIteratorError7 = false, _iteratorError7;
            try {
                for(var _iterator7 = swcHelpers.asyncIterator(iterableOfPromise), _step7; _iteratorAbruptCompletion7 = !(_step7 = yield swcHelpers.awaitAsyncGenerator(_iterator7.next())).done; _iteratorAbruptCompletion7 = false){
                    let _value = _step7.value;
                    const x = _value;
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion7 && _iterator7.return != null) {
                        yield _iteratorError7.return();
                    }
                } finally{
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion8 = false, _didIteratorError8 = false, _iteratorError8;
            try {
                for(var _iterator8 = swcHelpers.asyncIterator(asyncIterable), _step8; _iteratorAbruptCompletion8 = !(_step8 = yield swcHelpers.awaitAsyncGenerator(_iterator8.next())).done; _iteratorAbruptCompletion8 = false){
                    let _value = _step8.value;
                    y = _value;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion8 && _iterator8.return != null) {
                        yield _iteratorError8.return();
                    }
                } finally{
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion9 = false, _didIteratorError9 = false, _iteratorError9;
            try {
                for(var _iterator9 = swcHelpers.asyncIterator(iterable), _step9; _iteratorAbruptCompletion9 = !(_step9 = yield swcHelpers.awaitAsyncGenerator(_iterator9.next())).done; _iteratorAbruptCompletion9 = false){
                    let _value = _step9.value;
                    y = _value;
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion9 && _iterator9.return != null) {
                        yield _iteratorError9.return();
                    }
                } finally{
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }
        }
        {
            var _iteratorAbruptCompletion10 = false, _didIteratorError10 = false, _iteratorError10;
            try {
                for(var _iterator10 = swcHelpers.asyncIterator(iterableOfPromise), _step10; _iteratorAbruptCompletion10 = !(_step10 = yield swcHelpers.awaitAsyncGenerator(_iterator10.next())).done; _iteratorAbruptCompletion10 = false){
                    let _value = _step10.value;
                    y = _value;
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally{
                try {
                    if (_iteratorAbruptCompletion10 && _iterator10.return != null) {
                        yield _iteratorError10.return();
                    }
                } finally{
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }
        }
    });
    return _f2.apply(this, arguments);
}
