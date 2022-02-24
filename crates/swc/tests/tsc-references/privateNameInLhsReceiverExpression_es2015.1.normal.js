function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
var _y = new WeakMap();
// @target: es2015
class Test {
    static something(obj) {
        var _s;
        _classPrivateFieldSet(obj[(new (function() {
            var _x = new WeakMap();
            class _class {
                constructor(){
                    _classPrivateFieldInit(this, _x, {
                        writable: true,
                        value: 1
                    });
                    this.s = "prop";
                }
            }
            return _class;
        }())).s], _y, 1);
        _classPrivateFieldSet(_s = obj[(new (function() {
            var _x = new WeakMap();
            class _class {
                constructor(){
                    _classPrivateFieldInit(this, _x, {
                        writable: true,
                        value: 1
                    });
                    this.s = "prop";
                }
            }
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
