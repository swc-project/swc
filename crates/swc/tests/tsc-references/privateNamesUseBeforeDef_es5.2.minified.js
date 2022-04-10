import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _bar = new WeakMap(), A = function() {
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: swcHelpers.classPrivateFieldGet(this, _bar)
    }), swcHelpers.classPrivateFieldInit(this, _bar, {
        writable: !0,
        value: 3
    });
}, _foo1 = new WeakMap(), _bar1 = new WeakSet(), A2 = function() {
    swcHelpers.classCallCheck(this, A2), swcHelpers.classPrivateMethodInit(this, _bar1), swcHelpers.classPrivateFieldInit(this, _foo1, {
        writable: !0,
        value: swcHelpers.classPrivateMethodGet(this, _bar1, bar).call(this)
    });
};
function bar() {
    return 3;
}
var _foo2 = new WeakMap(), _bar2 = new WeakMap(), A3 = function() {
    swcHelpers.classCallCheck(this, A3), swcHelpers.classPrivateFieldInit(this, _bar2, {
        get: get_bar,
        set: void 0
    }), swcHelpers.classPrivateFieldInit(this, _foo2, {
        writable: !0,
        value: swcHelpers.classPrivateFieldGet(this, _bar2)
    });
};
function get_bar() {
    return 3;
}
var _foo3 = new WeakMap(), _bar3 = new WeakMap(), B = function() {
    swcHelpers.classCallCheck(this, B), swcHelpers.classPrivateFieldInit(this, _foo3, {
        writable: !0,
        value: swcHelpers.classPrivateFieldGet(this, _bar3)
    }), swcHelpers.classPrivateFieldInit(this, _bar3, {
        writable: !0,
        value: swcHelpers.classPrivateFieldGet(this, _foo3)
    });
};
