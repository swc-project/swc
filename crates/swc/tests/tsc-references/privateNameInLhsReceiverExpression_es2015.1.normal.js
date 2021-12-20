function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
// @target: es2015
class Test {
    static something(obj) {
        var _s;
        _classPrivateFieldSet(obj[(new (function() {
            class _class {
                constructor(){
                    _x.set(this, {
                        writable: true,
                        value: 1
                    });
                    this.s = "prop";
                }
            }
            var _x = new WeakMap();
            return _class;
        }())).s], _y, 1);
        _classPrivateFieldSet(_s = obj[(new (function() {
            class _class {
                constructor(){
                    _x.set(this, {
                        writable: true,
                        value: 1
                    });
                    this.s = "prop";
                }
            }
            var _x = new WeakMap();
            return _class;
        }())).s], _y, _classPrivateFieldGet(_s, _y) + 1);
    }
    constructor(){
        _y.set(this, {
            writable: true,
            value: 123
        });
    }
}
var _y = new WeakMap();
