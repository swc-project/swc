function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
const array = [];
for(let i = 0; i < 10; ++i)array.push(function() {
    var _myField = new WeakMap(), _method = new WeakSet(), _accessor = new WeakMap();
    class C {
        constructor(){
            _classPrivateMethodInit(this, _method), _classPrivateFieldInit(this, _accessor, {
                get: function() {
                    return 42;
                },
                set: set_accessor
            }), _classPrivateFieldInit(this, _myField, {
                writable: !0,
                value: "hello"
            });
        }
    }
    function set_accessor(val) {}
    return C;
}());
