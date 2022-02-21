function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
// @target: es2015
var array = [];
for(var i = 0; i < 10; ++i){
    array.push(function() {
        var method = function method() {};
        var accessor = function accessor() {
            return 42;
        };
        var accessor = function accessor(val) {};
        var _method = new WeakSet(), _accessor = new WeakSet(), _accessor = new WeakSet();
        var C = function C() {
            "use strict";
            _classCallCheck(this, C);
            _classPrivateFieldInit(this, _myField, {
                writable: true,
                value: "hello"
            });
            _classPrivateMethodInit(this, _method);
            _classPrivateMethodInit(this, _accessor);
            _classPrivateMethodInit(this, _accessor);
        };
        var _myField = new WeakMap();
        return C;
    }());
}
