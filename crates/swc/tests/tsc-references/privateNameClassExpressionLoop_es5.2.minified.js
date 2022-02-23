function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
for(var array = [], i = 0; i < 10; ++i)array.push(function() {
    var _method = new WeakSet(), _accessor = new WeakSet(), _accessor = new WeakSet(), C = function() {
        "use strict";
        _classCallCheck(this, C), _classPrivateFieldInit(this, _myField, {
            writable: !0,
            value: "hello"
        }), _classPrivateMethodInit(this, _method), _classPrivateMethodInit(this, _accessor), _classPrivateMethodInit(this, _accessor);
    }, _myField = new WeakMap();
    return C;
}());
