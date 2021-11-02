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
var a0 = [
    ,
    ,
    2,
    3,
    4
];
[
    ,
    ,
].concat(_toConsumableArray(a0), [
    "hello"
]), [
    ,
].concat(_toConsumableArray(a0)), _toConsumableArray(a0).concat([
    , 
]);
var ref = [
    1,
    2,
    !0
];
ref[0], ref[1];
var temp = [
    "s",
    "t",
    "r"
], temp1 = [
    1,
    2,
    3
];
[
    1,
    !0, 
].concat(_toConsumableArray(temp)), _toConsumableArray(temp), _toConsumableArray(temp1), _toConsumableArray(temp1), _toConsumableArray(temp).concat(_toConsumableArray(temp1)), _toConsumableArray([
    void 0,
    null,
    void 0
]), _toConsumableArray([]), _toConsumableArray(_toConsumableArray(temp1)), _toConsumableArray(temp1), [
    _toConsumableArray(temp1)
].concat(_toConsumableArray([
    "hello"
]));
