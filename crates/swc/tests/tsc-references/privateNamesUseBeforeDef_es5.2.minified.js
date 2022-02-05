function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
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
}, _foo = new WeakMap(), _bar = new WeakMap(), _bar1 = new WeakSet(), A2 = function() {
    "use strict";
    _classCallCheck(this, A2), _foo1.set(this, {
        writable: !0,
        value: _classPrivateMethodGet(this, _bar1, function() {
            return 3;
        }).call(this)
    }), _bar1.add(this);
}, _foo1 = new WeakMap(), _bar2 = new WeakSet(), A3 = function() {
    "use strict";
    _classCallCheck(this, A3), _foo2.set(this, {
        writable: !0,
        value: _classPrivateMethodGet(this, _bar2, function() {
            return 3;
        })
    }), _bar2.add(this);
}, _foo2 = new WeakMap(), B = function() {
    "use strict";
    _classCallCheck(this, B), _foo3.set(this, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar3)
    }), _bar3.set(this, {
        writable: !0,
        value: _classPrivateFieldGet(this, _foo3)
    });
}, _foo3 = new WeakMap(), _bar3 = new WeakMap();
