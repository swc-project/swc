function _asyncIterator(iterable) {
    var method;
    if (typeof Symbol === "function") {
        if (Symbol.asyncIterator) {
            method = iterable[Symbol.asyncIterator];
            if (method != null) return method.call(iterable);
        }
        if (Symbol.iterator) {
            method = iterable[Symbol.iterator];
            if (method != null) return method.call(iterable);
        }
    }
    throw new TypeError("Object is not async iterable");
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
_asyncToGenerator(function* () {
    let counter = 0;
    let resolve;
    let promise = new Promise((r) => resolve = r
    );
    let iterable = {
        [Symbol.asyncIterator]() {
            return {
                next() {
                    return promise;
                }
            };
        }
    };
    const res = _asyncToGenerator(function* () {
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for (var _iterator = _asyncIterator(iterable), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false) {
                    let _value = _step.value;
                    const value = _value;
                    counter++;
                    console.log(value);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (_iteratorAbruptCompletion && _iterator.return != null) {
                        yield _iteratorError.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        if (counter !== 2) {
            throw new Error('');
        }
    })();
    for (let v of [
        0,
        1
    ]) {
        yield null;
        let oldresolve = resolve;
        promise = new Promise((r) => resolve = r
        );
        oldresolve({
            value: v,
            done: false
        });
    }
    resolve({
        value: undefined,
        done: true
    });
    yield res;
})();
