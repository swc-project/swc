function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
var _name = new WeakMap();
console.log(new class {
    getValue(x) {
        var tmp = _classPrivateFieldGet(this, _name), _y = new WeakMap();
        return new class {
            [tmp]() {
                return x + _classPrivateFieldGet(this, _y);
            }
            constructor(){
                _y.set(this, {
                    writable: !0,
                    value: 100
                });
            }
        }()[_classPrivateFieldGet(this, _name)]();
    }
    constructor(name){
        _name.set(this, {
            writable: !0,
            value: void 0
        }), (function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        })(this, _name, name);
    }
}("NAME").getValue(100));
