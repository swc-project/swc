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
export class D extends C {
    method(iterable) {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _wrap_async_generator(function*() {
            const inner = async ()=>{
                {
                    var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                    try {
                        for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                            _step = await Reflect.apply(_next, _iterator, []);
                            if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                            _iteratorAbruptCompletion = !_step.done;
                            if (!_iteratorAbruptCompletion) break;
                            let _value = _step.value;
                            const item = _value;
                            return _superprop_get_method().call(_this, item);
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
            };
            yield yield _await_async_generator(inner());
        })();
    }
}
export class E extends C {
    constructor(){
        super();
        this.consume = async (iterable)=>{
            {
                var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                try {
                    for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                        _step = await Reflect.apply(_next, _iterator, []);
                        if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                        _iteratorAbruptCompletion = !_step.done;
                        if (!_iteratorAbruptCompletion) break;
                        let _value = _step.value;
                        const item = _value;
                        this.value = item;
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
        };
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
export async function getAll(iterable) {
    const results = [];
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const item = _value;
                results.push(await Promise.resolve(item));
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
    return results;
}
export async function labeled(iterable) {
    let count = 0;
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            outer: inner: for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const item = _value;
                if (item < 0) continue outer;
                count += item;
                if (count > 3) break inner;
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
    return count;
}
export async function mutableBinding(iterable) {
    let total = 0;
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                let item = _value;
                item += 1;
                total += item;
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
    return total;
}
export async function functionScopedBinding(iterable) {
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                var item = _value;
                if (item) break;
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
    return item;
}
export async function validatedResult(iterable) {
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const item = _value;
                return item;
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
export async function cachedNext(iterable) {
    const values = [];
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const item = _value;
                values.push(item);
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
    return values;
}
export const consume = async (iterable)=>{
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
        try {
            for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const item = _value;
                if (item) break;
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
};
export const consumer = {
    async method (iterable) {
        {
            var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
            try {
                for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                    _step = await Reflect.apply(_next, _iterator, []);
                    if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                    _iteratorAbruptCompletion = !_step.done;
                    if (!_iteratorAbruptCompletion) break;
                    let _value = _step.value;
                    const item = _value;
                    return item;
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
};
export function nested(_0) {
    return _wrap_async_generator(function*(iterable) {
        const inner = async function() {
            {
                var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                try {
                    for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                        _step = await Reflect.apply(_next, _iterator, []);
                        if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                        _iteratorAbruptCompletion = !_step.done;
                        if (!_iteratorAbruptCompletion) break;
                        let _value = _step.value;
                        const item = _value;
                        return item;
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
        };
        const innerArrow = async ()=>{
            const deepest = async ()=>{
                {
                    var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                    try {
                        for(var _iterator = _async_iterator(iterable), _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                            _step = await Reflect.apply(_next, _iterator, []);
                            if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                            _iteratorAbruptCompletion = !_step.done;
                            if (!_iteratorAbruptCompletion) break;
                            let _value = _step.value;
                            const item = _value;
                            return [
                                this,
                                arguments[0],
                                item
                            ];
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
            };
            return deepest();
        };
        yield yield _await_async_generator(inner());
        yield yield _await_async_generator(innerArrow());
    }).apply(this, arguments);
}
