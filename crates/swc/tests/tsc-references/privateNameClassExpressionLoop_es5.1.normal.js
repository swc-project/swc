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
    var method = function method() {};
    var get_accessor = function get_accessor() {
        return 42;
    };
    var set_accessor = function set_accessor(val) {};
    var _myField, _method, _accessor, _C;
    array.push((_myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap(), _C = function C() {
        "use strict";
        _classCallCheck(this, C);
        _classPrivateMethodInit(this, _method);
        _classPrivateFieldInit(this, _accessor, {
            get: get_accessor,
            set: set_accessor
        });
        _classPrivateFieldInit(this, _myField, {
            writable: true,
            value: "hello"
        });
    }, _C));
}
