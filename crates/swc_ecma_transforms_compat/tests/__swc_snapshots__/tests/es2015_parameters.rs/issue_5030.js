var v0 = function(Array1, Int8Array) {
    for(var _len = arguments.length, Int32Array = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        Int32Array[_key - 2] = arguments[_key];
    }
    return (NaN + Infinity) * Int32Array.length;
};
console.log(v0(1, 2, 'hello', true, 7));
