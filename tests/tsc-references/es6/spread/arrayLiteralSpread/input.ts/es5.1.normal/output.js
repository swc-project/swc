function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function f0() {
    var a = [
        1,
        2,
        3
    ];
    var a1 = _toConsumableArray(a);
    var a2 = [
        1
    ].concat(_toConsumableArray(a));
    var a3 = [
        1,
        2
    ].concat(_toConsumableArray(a));
    var a4 = _toConsumableArray(a).concat([
        1
    ]);
    var a5 = _toConsumableArray(a).concat([
        1,
        2
    ]);
    var a6 = [
        1,
        2
    ].concat(_toConsumableArray(a), [
        1,
        2
    ]);
    var a7 = [
        1
    ].concat(_toConsumableArray(a), [
        2
    ], _toConsumableArray(a));
    var a8 = _toConsumableArray(a).concat(_toConsumableArray(a), _toConsumableArray(a));
}
function f1() {
    var a = [
        1,
        2,
        3
    ];
    var b = [
        "hello"
    ].concat(_toConsumableArray(a), [
        true
    ]);
    var b;
}
function f2() {
    var a = _toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray([])))));
    var b = _toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray(_toConsumableArray([
        5
    ])))));
}
