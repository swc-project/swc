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
var ref = [
    1,
    2,
    "string",
    !0
];
ref[0], ref[1];
var temp1 = [
    1,
    2,
    3
];
_toConsumableArray([
    [
        1,
        2,
        3
    ],
    [
        "hello",
        "string"
    ]
]), _toConsumableArray(temp1), _toConsumableArray(temp1).concat(_toConsumableArray([
    "s",
    "t",
    "r"
]));
