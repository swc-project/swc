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
            _value.set(this, {
                writable: !0,
                value: void 0
            });
        }
    }().value = 3;
}(Generic || (Generic = {}));
