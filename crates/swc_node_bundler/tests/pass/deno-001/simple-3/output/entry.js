function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function deferred() {}
class MuxAsyncIterator {
    constructor(){
        _defineProperty(this, "signal", deferred());
    }
}
console.log(deferred, MuxAsyncIterator);
