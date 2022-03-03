function _defineProperty(obj1, key, value) {
    if (key in obj1) {
        Object.defineProperty(obj1, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj1[key] = value;
    }
    return obj1;
}
//@target: ES6
var obj = _defineProperty({}, Symbol.iterator, 0);
var M;
(function(M) {
    var _$Symbol;
    // The following should be of type 'any'. This is because even though obj has a property keyed by Symbol.iterator,
    // the key passed in here is the *wrong* Symbol.iterator. It is not the iterator property of the global Symbol.
    obj[_$Symbol["iterator"]];
})(M || (M = {}));
