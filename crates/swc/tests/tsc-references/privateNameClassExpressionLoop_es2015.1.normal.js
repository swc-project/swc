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
    array.push(function() {
        var _method = new WeakSet(), _accessor = new WeakSet(), _accessor = new WeakSet();
        class C {
            constructor(){
                _classPrivateFieldInit(this, _myField, {
                    writable: true,
                    value: "hello"
                });
                _classPrivateMethodInit(this, _method);
                _classPrivateMethodInit(this, _accessor);
                _classPrivateMethodInit(this, _accessor);
            }
        }
        var _myField = new WeakMap();
        function method() {}
        function accessor() {
            return 42;
        }
        function accessor(val) {}
        return C;
    }());
}
