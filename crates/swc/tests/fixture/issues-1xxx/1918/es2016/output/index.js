import * as swcHelpers from "@swc/helpers";
swcHelpers.asyncToGenerator(function*() {
    let counter = 0;
    let resolve;
    let promise = new Promise((r)=>resolve = r
    );
    let iterable = {
        [Symbol.asyncIterator] () {
            return {
                next () {
                    return promise;
                }
            };
        }
    };
    const res = swcHelpers.asyncToGenerator(function*() {
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = swcHelpers.asyncIterator(iterable), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const value = _value;
                    counter++;
                    console.log(value);
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
        if (counter !== 2) {
            throw new Error("");
        }
    })();
    for (let v of [
        0,
        1
    ]){
        yield null;
        let oldresolve = resolve;
        promise = new Promise((r)=>resolve = r
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
