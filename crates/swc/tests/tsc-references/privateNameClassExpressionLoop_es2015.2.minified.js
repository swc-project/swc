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
for(let i = 0; i < 10; ++i){
    var _myField;
    function set_accessor(val) {}
    array.push((_myField = new WeakMap(), class {
        constructor(){
            _classPrivateMethodInit(this, new WeakSet()), _classPrivateFieldInit(this, new WeakMap(), {
                get: function() {
                    return 42;
                },
                set: set_accessor
            }), _classPrivateFieldInit(this, _myField, {
                writable: !0,
                value: "hello"
            });
        }
    }));
}
