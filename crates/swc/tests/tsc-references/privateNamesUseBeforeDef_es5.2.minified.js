function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
var A = function() {
    "use strict";
    _classCallCheck(this, A), _foo.set(this, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar)
    }), _bar.set(this, {
        writable: !0,
        value: 3
    });
}, _foo = new WeakMap(), _bar = new WeakMap(), B = function() {
    "use strict";
    _classCallCheck(this, B), _foo1.set(this, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar1)
    }), _bar1.set(this, {
        writable: !0,
        value: _classPrivateFieldGet(this, _foo1)
    });
}, _foo1 = new WeakMap(), _bar1 = new WeakMap();
