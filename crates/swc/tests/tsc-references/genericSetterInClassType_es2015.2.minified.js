var Generic;
!function(Generic) {
    var c = new class {
        get y() {
            return 1;
        }
        set y(v) {}
    }();
    c.y = c.y;
    var _value = new WeakMap();
    new class {
        get value() {
            return (function(receiver, privateMap) {
                if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                return privateMap.get(receiver).value;
            })(this, _value);
        }
        set value(value1) {
            !function(receiver, privateMap, value) {
                if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                var descriptor = privateMap.get(receiver);
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                return descriptor.value = value, value;
            }(this, _value, value1);
        }
        constructor(){
            var obj, privateMap, value;
            obj = this, value = {
                writable: !0,
                value: void 0
            }, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap = _value), privateMap.set(obj, value);
        }
    }().value = 3;
}(Generic || (Generic = {}));
