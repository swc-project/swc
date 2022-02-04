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
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _foo.set(this, {
        writable: true,
        value: _classPrivateFieldGet(this, _bar)
    });
    _bar.set(this, {
        writable: true,
        value: 3
    });
};
var _foo = new WeakMap();
var _bar = new WeakMap();
var _bar1 = new WeakSet();
var A2 = function A2() {
    "use strict";
    _classCallCheck(this, A2);
    _foo1.set(this, {
        writable: true,
        value: _classPrivateMethodGet(this, _bar1, bar).call(this)
    });
    _bar1.add(this);
};
var _foo1 = new WeakMap();
function bar() {
    return 3;
}
var _bar2 = new WeakSet();
var A3 = function A3() {
    "use strict";
    _classCallCheck(this, A3);
    _foo2.set(this, {
        writable: true,
        value: _classPrivateMethodGet(this, _bar2, bar1)
    });
    _bar2.add(this);
};
var _foo2 = new WeakMap();
function bar1() {
    return 3;
}
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
    _foo3.set(this, {
        writable: true,
        value: _classPrivateFieldGet(this, _bar3)
    });
    _bar3.set(this, {
        writable: true,
        value: _classPrivateFieldGet(this, _foo3)
    });
};
var _foo3 = new WeakMap();
var _bar3 = new WeakMap();
