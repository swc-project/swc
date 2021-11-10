function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) {
            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
}
all.apply(void 0, _toConsumableArray(ns)), weird.apply(void 0, _toConsumableArray(ns)), weird.apply(void 0, _toConsumableArray(mixed)), weird.apply(void 0, _toConsumableArray(tuple)), prefix.apply(void 0, [
    "a"
].concat(_toConsumableArray(ns))), rest.apply(void 0, [
    "d"
].concat(_toConsumableArray(ns))), normal.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns))), thunk.apply(void 0, _toConsumableArray(ns)), all.apply(void 0, _toConsumableArray(mixed)), all.apply(void 0, _toConsumableArray(tuple)), prefix.apply(void 0, [
    "b"
].concat(_toConsumableArray(mixed))), prefix.apply(void 0, [
    "c"
].concat(_toConsumableArray(tuple))), rest.apply(void 0, [
    "e"
].concat(_toConsumableArray(mixed))), rest.apply(void 0, [
    "f"
].concat(_toConsumableArray(tuple))), prefix.apply(void 0, _toConsumableArray(ns)), prefix.apply(void 0, _toConsumableArray(mixed)), prefix.apply(void 0, _toConsumableArray(tuple)), prefix2.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns)));
