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
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
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
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var _used = new WeakMap(), _unused = new WeakMap();
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _classPrivateFieldInit(this, _used, {
        writable: true,
        value: "used"
    });
    _classPrivateFieldInit(this, _unused, {
        writable: true,
        value: "unused"
    });
    console.log(_classPrivateFieldGet(this, _used));
};
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export var A2 = function A2() {
    "use strict";
    _classCallCheck(this, A2);
    _classPrivateMethodInit(this, _used1);
    _classPrivateMethodInit(this, _unused1);
    console.log(_classPrivateMethodGet(this, _used1, used1).call(this));
};
function used1() {}
function unused() {}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export var A3 = function A3() {
    "use strict";
    _classCallCheck(this, A3);
    _classPrivateFieldInit(this, _used2, {
        get: get_used,
        set: set_used
    });
    _classPrivateFieldInit(this, _unused2, {
        get: get_unused,
        set: set_unused
    });
    console.log(_classPrivateMethodGet(this, _used2, used));
};
function get_used() {
    return 0;
}
function set_used(value) {}
function get_unused() {
    return 0;
}
function set_unused(value) {}
