import "core-js/modules/es.promise.js";
export default function() {
    return _wrap_async_generator(function*() {
        yield 1;
    })();
}
export const expression = function() {
    return _wrap_async_generator(function*() {
        yield 2;
    })();
};
export function declaration() {
    return _wrap_async_generator(function*() {
        yield 3;
    })();
}
export const probe = !!function() {
    return _wrap_async_generator(function*() {
        yield 4;
    })();
};
export const object = {
    method () {
        return _wrap_async_generator(function*() {
            yield yield _await_async_generator(Promise.resolve(5));
        })();
    }
};
export class C {
    method() {
        return _wrap_async_generator(function*() {
            yield 6;
        })();
    }
}
export function values(iterable) {
    return _wrap_async_generator(function*() {
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(iterable), _step; _iteratorAbruptCompletion = !(_step = yield _await_async_generator(_iterator.next())).done; _iteratorAbruptCompletion = false){
                    let _value = _step.value;
                    const value = _value;
                    yield value;
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
export async function ordinary() {
    return await Promise.resolve(7);
}
