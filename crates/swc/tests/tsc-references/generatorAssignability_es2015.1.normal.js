import * as swcHelpers from "@swc/helpers";
// spread iterable
[
    ...g1
]; // error
[
    ...g2
]; // ok
// binding pattern over iterable
let [x1] = g1; // error
let [x2] = g2; // ok
// binding rest pattern over iterable
let [...y1] = g1; // error
let [...y2] = g2; // ok
// assignment pattern over iterable
[_] = g1; // error
[_] = g2; // ok
// assignment rest pattern over iterable
[..._] = g1; // error
[..._] = g2; // ok
// for-of over iterable
for (_ of g1); // error
for (_ of g2); // ok
function asyncfn() {
    return _asyncfn.apply(this, arguments);
}
function _asyncfn() {
    _asyncfn = swcHelpers.asyncToGenerator(function*() {
        // for-await-of over iterable
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = swcHelpers.asyncIterator(g1), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    _ = _value;
                    ; // error
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
                for(var _iterator1 = swcHelpers.asyncIterator(g2), _step1; _iteratorAbruptCompletion1 = !(_step1 = yield _iterator1.next()).done; _iteratorAbruptCompletion1 = false){
                    let _value = _step1.value;
                    _ = _value;
                    ; // ok
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
        // for-await-of over asynciterable
        {
            var _iteratorAbruptCompletion2 = false, _didIteratorError2 = false, _iteratorError2;
            try {
                for(var _iterator2 = swcHelpers.asyncIterator(g4), _step2; _iteratorAbruptCompletion2 = !(_step2 = yield _iterator2.next()).done; _iteratorAbruptCompletion2 = false){
                    let _value = _step2.value;
                    _ = _value;
                    ; // error
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
                for(var _iterator3 = swcHelpers.asyncIterator(g5), _step3; _iteratorAbruptCompletion3 = !(_step3 = yield _iterator3.next()).done; _iteratorAbruptCompletion3 = false){
                    let _value = _step3.value;
                    _ = _value;
                    ; // ok
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
    });
    return _asyncfn.apply(this, arguments);
}
function* f1() {
    // yield* over iterable
    yield* g1; // error
    yield* g3; // ok
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = swcHelpers.wrapAsyncGenerator(function*() {
        // yield* over iterable
        yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g1), swcHelpers.awaitAsyncGenerator); // error
        yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g3), swcHelpers.awaitAsyncGenerator); // ok
        // yield* over asynciterable
        yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g4), swcHelpers.awaitAsyncGenerator); // error
        yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(g6), swcHelpers.awaitAsyncGenerator); // ok
    });
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = swcHelpers.asyncToGenerator(function*() {
        const syncGenerator = function*() {
            yield 1;
            yield 2;
        };
        const o = {
            [Symbol.asyncIterator]: syncGenerator
        };
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = swcHelpers.asyncIterator(o), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
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
    });
    return _f3.apply(this, arguments);
}
