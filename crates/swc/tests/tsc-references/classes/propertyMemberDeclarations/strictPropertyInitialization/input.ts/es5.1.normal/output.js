function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
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
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
    _f.set(this, {
        writable: true,
        value: void 0 //Error
    });
    _g.set(this, {
        writable: true,
        value: void 0
    });
    _h.set(this, {
        writable: true,
        value: void 0 //Error
    });
    _i.set(this, {
        writable: true,
        value: void 0
    });
};
var _f = new WeakMap();
var _g = new WeakMap();
var _h = new WeakMap();
var _i = new WeakMap();
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var C4 = function C4() {
    "use strict";
    _classCallCheck(this, C4);
    _d.set(this, {
        writable: true,
        value: 0
    });
    _e.set(this, {
        writable: true,
        value: 0
    });
    _f1.set(this, {
        writable: true,
        value: "abc"
    });
    // Initializer satisfies strict initialization check
    this.a = 0;
    this.b = 0;
    this.c = "abc";
};
var _d = new WeakMap();
var _e = new WeakMap();
var _f1 = new WeakMap();
var C5 = function C5() {
    "use strict";
    _classCallCheck(this, C5);
    _b.set(this, {
        writable: true,
        value: void 0
    });
    this.a = 0;
    _classPrivateFieldSet(this, _b, 0);
};
var _b = new WeakMap();
var C6 = function C6(cond) {
    "use strict";
    _classCallCheck(this, C6);
    _b1.set(this, {
        writable: true,
        value: void 0
    });
    if (cond) {
        return;
    }
    this.a = 0;
    _classPrivateFieldSet(this, _b1, 0);
};
var _b1 = new WeakMap();
var C7 = function C7(cond) {
    "use strict";
    _classCallCheck(this, C7);
    _b2.set(this, {
        writable: true,
        value: void 0
    });
    if (cond) {
        this.a = 1;
        _classPrivateFieldSet(this, _b2, 1);
        return;
    }
    this.a = 0;
    _classPrivateFieldSet(this, _b2, 1);
};
var _b2 = new WeakMap();
var C8 = function C8() {
    "use strict";
    _classCallCheck(this, C8);
};
var C9 = function C9() {
    "use strict";
    _classCallCheck(this, C9);
};
var C10 = function C10() {
    "use strict";
    _classCallCheck(this, C10);
    _d1.set(this, {
        writable: true,
        value: void 0
    });
    var x = this.a; // Error
    this.a = this.b; // Error
    this.b = _classPrivateFieldGet(this, _d1 //Error
    );
    this.b = x;
    _classPrivateFieldSet(this, _d1, x);
    var y = this.c;
};
var _d1 = new WeakMap();
var C11 = function C11() {
    "use strict";
    _classCallCheck(this, C11);
    _b3.set(this, {
        writable: true,
        value: void 0
    });
    this.a = someValue();
    _classPrivateFieldSet(this, _b3, someValue());
};
var _b3 = new WeakMap();
