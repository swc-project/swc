function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1), _classPrivateFieldInit(this, _f, {
        writable: !0,
        value: void 0
    }), _classPrivateFieldInit(this, _g, {
        writable: !0,
        value: void 0
    }), _classPrivateFieldInit(this, _h, {
        writable: !0,
        value: void 0
    }), _classPrivateFieldInit(this, _i, {
        writable: !0,
        value: void 0
    });
}, _f = new WeakMap(), _g = new WeakMap(), _h = new WeakMap(), _i = new WeakMap(), C3 = function() {
    "use strict";
    _classCallCheck(this, C3);
}, C4 = function() {
    "use strict";
    _classCallCheck(this, C4), _classPrivateFieldInit(this, _d, {
        writable: !0,
        value: 0
    }), _classPrivateFieldInit(this, _e, {
        writable: !0,
        value: 0
    }), _classPrivateFieldInit(this, _f1, {
        writable: !0,
        value: "abc"
    }), this.a = 0, this.b = 0, this.c = "abc";
}, _d = new WeakMap(), _e = new WeakMap(), _f1 = new WeakMap(), C5 = function() {
    "use strict";
    _classCallCheck(this, C5), _classPrivateFieldInit(this, _b, {
        writable: !0,
        value: void 0
    }), this.a = 0, _classPrivateFieldSet(this, _b, 0);
}, _b = new WeakMap(), C6 = function(cond) {
    "use strict";
    _classCallCheck(this, C6), _classPrivateFieldInit(this, _b1, {
        writable: !0,
        value: void 0
    }), cond || (this.a = 0, _classPrivateFieldSet(this, _b1, 0));
}, _b1 = new WeakMap(), C7 = function(cond) {
    "use strict";
    if (_classCallCheck(this, C7), _classPrivateFieldInit(this, _b2, {
        writable: !0,
        value: void 0
    }), cond) {
        this.a = 1, _classPrivateFieldSet(this, _b2, 1);
        return;
    }
    this.a = 0, _classPrivateFieldSet(this, _b2, 1);
}, _b2 = new WeakMap(), C8 = function() {
    "use strict";
    _classCallCheck(this, C8);
}, C9 = function() {
    "use strict";
    _classCallCheck(this, C9);
}, C10 = function() {
    "use strict";
    _classCallCheck(this, C10), _classPrivateFieldInit(this, _d1, {
        writable: !0,
        value: void 0
    });
    var receiver, privateMap, descriptor, receiver, descriptor, x = this.a;
    this.a = this.b, receiver = this, this.b = (descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _d1, "get")).get ? descriptor.get.call(receiver) : descriptor.value, this.b = x, _classPrivateFieldSet(this, _d1, x), this.c;
}, _d1 = new WeakMap(), C11 = function() {
    "use strict";
    _classCallCheck(this, C11), _classPrivateFieldInit(this, _b3, {
        writable: !0,
        value: void 0
    }), this.a = someValue(), _classPrivateFieldSet(this, _b3, someValue());
}, _b3 = new WeakMap();
