function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    "use strict";
    _classCallCheck(this, A), _classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar)
    }), _classPrivateFieldInit(this, _bar, {
        writable: !0,
        value: 3
    });
}, _foo1 = new WeakMap(), _bar1 = new WeakSet(), A2 = function() {
    "use strict";
    var obj, privateSet;
    _classCallCheck(this, A2), obj = this, _checkPrivateRedeclaration(obj, privateSet = _bar1), privateSet.add(obj), _classPrivateFieldInit(this, _foo1, {
        writable: !0,
        value: (function(receiver, privateSet, fn) {
            if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return fn;
        })(this, _bar1, function() {
            return 3;
        }).call(this)
    });
}, _foo2 = new WeakMap(), _bar2 = new WeakMap(), A3 = function() {
    "use strict";
    _classCallCheck(this, A3), _classPrivateFieldInit(this, _bar2, {
        get: function() {
            return 3;
        },
        set: void 0
    }), _classPrivateFieldInit(this, _foo2, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar2)
    });
}, _foo3 = new WeakMap(), _bar3 = new WeakMap(), B = function() {
    "use strict";
    _classCallCheck(this, B), _classPrivateFieldInit(this, _foo3, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar3)
    }), _classPrivateFieldInit(this, _bar3, {
        writable: !0,
        value: _classPrivateFieldGet(this, _foo3)
    });
};
