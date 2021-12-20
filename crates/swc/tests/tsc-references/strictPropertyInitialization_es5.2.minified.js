function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1), _f.set(this, {
        writable: !0,
        value: void 0
    }), _g.set(this, {
        writable: !0,
        value: void 0
    }), _h.set(this, {
        writable: !0,
        value: void 0
    }), _i.set(this, {
        writable: !0,
        value: void 0
    });
}, _f = new WeakMap(), _g = new WeakMap(), _h = new WeakMap(), _i = new WeakMap(), C3 = function() {
    "use strict";
    _classCallCheck(this, C3);
}, C4 = function() {
    "use strict";
    _classCallCheck(this, C4), _d.set(this, {
        writable: !0,
        value: 0
    }), _e.set(this, {
        writable: !0,
        value: 0
    }), _f1.set(this, {
        writable: !0,
        value: "abc"
    }), this.a = 0, this.b = 0, this.c = "abc";
}, _d = new WeakMap(), _e = new WeakMap(), _f1 = new WeakMap(), C5 = function() {
    "use strict";
    _classCallCheck(this, C5), _b.set(this, {
        writable: !0,
        value: void 0
    }), this.a = 0, _classPrivateFieldSet(this, _b, 0);
}, _b = new WeakMap(), C6 = function(cond) {
    "use strict";
    _classCallCheck(this, C6), _b1.set(this, {
        writable: !0,
        value: void 0
    }), cond || (this.a = 0, _classPrivateFieldSet(this, _b1, 0));
}, _b1 = new WeakMap(), C7 = function(cond) {
    "use strict";
    if (_classCallCheck(this, C7), _b2.set(this, {
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
    _classCallCheck(this, C10), _d1.set(this, {
        writable: !0,
        value: void 0
    });
    var x = this.a;
    this.a = this.b, this.b = (function(receiver, privateMap) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver).value;
    })(this, _d1), this.b = x, _classPrivateFieldSet(this, _d1, x), this.c;
}, _d1 = new WeakMap(), C11 = function() {
    "use strict";
    _classCallCheck(this, C11), _b3.set(this, {
        writable: !0,
        value: void 0
    }), this.a = someValue(), _classPrivateFieldSet(this, _b3, someValue());
}, _b3 = new WeakMap();
