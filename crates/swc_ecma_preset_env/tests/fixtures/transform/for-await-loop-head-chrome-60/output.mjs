export async function direct() {
    const items = [
        1,
        2
    ];
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError, _return;
        try {
            var _iterator;
            for(let [items] in _iterator = _async_iterator(items), null){}
            if (_iterator === null || typeof _iterator !== "object" && typeof _iterator !== "function") throw new TypeError("Iterator result is not an object");
            for(var _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                let items = _value;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (_iteratorAbruptCompletion && (_return = _iterator.return) != null) {
                    _step = await Reflect.apply(_return, _iterator, []);
                    if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
export async function captured(source) {
    let getter;
    const callbacks = [];
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError, _return;
        try {
            var _iterator;
            for(let [item] in _iterator = _async_iterator((getter = ()=>typeof item, source)), null){}
            if (_iterator === null || typeof _iterator !== "object" && typeof _iterator !== "function") throw new TypeError("Iterator result is not an object");
            outer: inner: for(var _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                const { item } = _value;
                callbacks.push(()=>item);
                continue outer;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (_iteratorAbruptCompletion && (_return = _iterator.return) != null) {
                    _step = await Reflect.apply(_return, _iterator, []);
                    if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return [
        getter,
        callbacks
    ];
}
export const suspended = async ()=>{
    let getter;
    {
        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError, _return;
        try {
            var _iterator;
            for(let [first, second] in _iterator = _async_iterator(await Promise.resolve((getter = ()=>[
                    first,
                    second
                ], [
                [
                    1,
                    2
                ]
            ]))), null){}
            if (_iterator === null || typeof _iterator !== "object" && typeof _iterator !== "function") throw new TypeError("Iterator result is not an object");
            for(var _next = _iterator.next, _step;; _iteratorAbruptCompletion = false){
                _step = await Reflect.apply(_next, _iterator, []);
                if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                _iteratorAbruptCompletion = !_step.done;
                if (!_iteratorAbruptCompletion) break;
                let _value = _step.value;
                let [first, second] = _value;
                return getter;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (_iteratorAbruptCompletion && (_return = _iterator.return) != null) {
                    _step = await Reflect.apply(_return, _iterator, []);
                    if (_step === null || typeof _step !== "object" && typeof _step !== "function") throw new TypeError("Iterator result is not an object");
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
};
