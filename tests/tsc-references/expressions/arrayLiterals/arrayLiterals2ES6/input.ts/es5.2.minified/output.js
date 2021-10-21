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
], a2 = [
    ,
    ,
].concat(_toConsumableArray(a0), [
    "hello"
]), a3 = [
    ,
].concat(_toConsumableArray(a0));
_toConsumableArray(a0).concat([
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
].concat(_toConsumableArray(temp)), _toConsumableArray(temp), _toConsumableArray(temp1), _toConsumableArray(temp1), _toConsumableArray(temp).concat(_toConsumableArray(temp1)), _toConsumableArray(a2), _toConsumableArray(a3), _toConsumableArray([
    function() {
        return 1;
    }, 
]), _toConsumableArray(temp1), [
    _toConsumableArray(temp1)
].concat(_toConsumableArray([
    "hello"
]));
