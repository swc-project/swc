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
var tup = [
    1,
    2,
    3,
    4
];
[
    1,
    2,
    3
].concat(_toConsumableArray([
    1,
    2,
    3
])), [
    1,
    2,
    3
].concat(_toConsumableArray(tup)), [
    1,
    2,
    3
].concat(_toConsumableArray(tup));
