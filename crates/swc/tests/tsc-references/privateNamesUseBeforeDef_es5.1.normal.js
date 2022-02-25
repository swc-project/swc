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
var _foo = new WeakMap(), _bar = new WeakMap();
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _classPrivateFieldInit(this, _foo, {
        writable: true,
        value: _classPrivateFieldGet(this, _bar)
    }) // Error
    ;
    _classPrivateFieldInit(this, _bar, {
        writable: true,
        value: 3
    });
};
var _foo1 = new WeakMap(), _bar1 = new WeakSet();
var A2 = function A2() {
    "use strict";
    _classCallCheck(this, A2);
    _classPrivateFieldInit(this, _foo1, {
        writable: true,
        value: _classPrivateMethodGet(this, _bar1, bar1).call(this)
    }) // No Error
    ;
    _classPrivateMethodInit(this, _bar1);
};
function bar1() {
    return 3;
}
var _foo2 = new WeakMap(), _bar2 = new WeakMap();
var A3 = function A3() {
    "use strict";
    _classCallCheck(this, A3);
    _classPrivateFieldInit(this, _foo2, {
        writable: true,
        value: _classPrivateMethodGet(this, _bar2, bar)
    }) // No Error
    ;
    _classPrivateFieldInit(this, _bar2, {
        get: get_bar,
        set: void 0
    });
};
function get_bar() {
    return 3;
}
var _foo3 = new WeakMap(), _bar3 = new WeakMap();
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _classPrivateFieldInit(this, _foo3, {
        writable: true,
        value: _classPrivateFieldGet(this, _bar3)
    }) // Error
    ;
    _classPrivateFieldInit(this, _bar3, {
        writable: true,
        value: _classPrivateFieldGet(this, _foo3)
    });
};
