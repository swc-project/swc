function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
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
const array = [];
for(let i = 0; i < 10; ++i){
    var _myField, _method, _accessor, _C;
    array.push((_myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap(), _C = class C {
        constructor(){
            _classPrivateMethodInit(this, _method);
            _classPrivateFieldInit(this, _accessor, {
                get: get_accessor,
                set: set_accessor
            });
            _classPrivateFieldInit(this, _myField, {
                writable: true,
                value: "hello"
            });
        }
    }, _C));
    function method() {}
    function get_accessor() {
        return 42;
    }
    function set_accessor(val) {}
}
