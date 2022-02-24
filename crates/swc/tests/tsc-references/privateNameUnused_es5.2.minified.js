function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _used = new WeakMap(), _unused = new WeakMap();
export var A = function() {
    "use strict";
    var receiver, privateMap, descriptor, receiver, descriptor;
    _classCallCheck(this, A), _classPrivateFieldInit(this, _used, {
        writable: !0,
        value: "used"
    }), _classPrivateFieldInit(this, _unused, {
        writable: !0,
        value: "unused"
    }), console.log((receiver = this, (descriptor = descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap = _used, "get")).get ? descriptor.get.call(receiver) : descriptor.value));
};
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export var A2 = function() {
    "use strict";
    _classCallCheck(this, A2), _classPrivateMethodInit(this, _used1), _classPrivateMethodInit(this, _unused1), console.log(_classPrivateMethodGet(this, _used1, used1).call(this));
};
function used1() {}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export var A3 = function() {
    "use strict";
    _classCallCheck(this, A3), _classPrivateFieldInit(this, _used2, {
        get: function() {
            return 0;
        },
        set: set_used
    }), _classPrivateFieldInit(this, _unused2, {
        get: function() {
            return 0;
        },
        set: set_unused
    }), console.log(_classPrivateMethodGet(this, _used2, used));
};
function set_used(value) {}
function set_unused(value) {}
