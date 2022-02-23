function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
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
                    _classPrivateFieldInit(this, _x, {
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
                    _classPrivateFieldInit(this, _x, {
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
        _classPrivateFieldInit(this, _y, {
            writable: true,
            value: 123
        });
    }
}
var _y = new WeakMap();
