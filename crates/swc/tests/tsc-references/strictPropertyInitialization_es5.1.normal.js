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
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
    _classPrivateFieldInit(this, _f, {
        writable: true,
        value: void 0 //Error
    });
    _classPrivateFieldInit(this, _g, {
        writable: true,
        value: void 0
    });
    _classPrivateFieldInit(this, _h, {
        writable: true,
        value: void 0 //Error
    });
    _classPrivateFieldInit(this, _i, {
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
    _classPrivateFieldInit(this, _d, {
        writable: true,
        value: 0
    });
    _classPrivateFieldInit(this, _e, {
        writable: true,
        value: 0
    });
    _classPrivateFieldInit(this, _f1, {
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
    _classPrivateFieldInit(this, _b, {
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
    _classPrivateFieldInit(this, _b1, {
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
    _classPrivateFieldInit(this, _b2, {
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
    _classPrivateFieldInit(this, _d1, {
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
    _classPrivateFieldInit(this, _b3, {
        writable: true,
        value: void 0
    });
    this.a = someValue();
    _classPrivateFieldSet(this, _b3, someValue());
};
var _b3 = new WeakMap();
