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
export var A = function() {
    "use strict";
    _classCallCheck(this, A), _classPrivateFieldInit(this, _used, {
        writable: !0,
        value: "used"
    }), _classPrivateFieldInit(this, _unused, {
        writable: !0,
        value: "unused"
    }), console.log(function(receiver, privateMap) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver).value;
    }(this, _used));
};
var _used = new WeakMap(), _unused = new WeakMap(), _used1 = new WeakSet(), _unused1 = new WeakSet();
export var A2 = function() {
    "use strict";
    _classCallCheck(this, A2), _classPrivateMethodInit(this, _used1), _classPrivateMethodInit(this, _unused1), console.log(_classPrivateMethodGet(this, _used1, used).call(this));
};
function used() {}
var _used2 = new WeakSet(), _used2 = new WeakSet(), _unused2 = new WeakSet(), _unused2 = new WeakSet();
export var A3 = function() {
    "use strict";
    _classCallCheck(this, A3), _classPrivateMethodInit(this, _used2), _classPrivateMethodInit(this, _used2), _classPrivateMethodInit(this, _unused2), _classPrivateMethodInit(this, _unused2), console.log(_classPrivateMethodGet(this, _used2, used1));
};
function used1() {
    return 0;
}
function used1(value) {}
