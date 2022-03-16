import * as swcHelpers from "@swc/helpers";
var _used = /*#__PURE__*/ new WeakMap(), _unused = /*#__PURE__*/ new WeakMap();
// @noUnusedLocals:true 
// @noEmit: true
// @target: es2015
export var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classPrivateFieldInit(this, _used, {
        writable: true,
        value: "used"
    });
    swcHelpers.classPrivateFieldInit(this, _unused, {
        writable: true,
        value: "unused"
    });
    console.log(swcHelpers.classPrivateFieldGet(this, _used));
};
var _used1 = /*#__PURE__*/ new WeakSet(), _unused1 = /*#__PURE__*/ new WeakSet();
export var A2 = function A2() {
    "use strict";
    swcHelpers.classCallCheck(this, A2);
    swcHelpers.classPrivateMethodInit(this, _used1);
    swcHelpers.classPrivateMethodInit(this, _unused1);
    console.log(swcHelpers.classPrivateMethodGet(this, _used1, used).call(this));
};
function used() {}
function unused() {}
var _used2 = /*#__PURE__*/ new WeakMap(), _unused2 = /*#__PURE__*/ new WeakMap();
export var A3 = function A3() {
    "use strict";
    swcHelpers.classCallCheck(this, A3);
    swcHelpers.classPrivateFieldInit(this, _used2, {
        get: get_used,
        set: set_used
    });
    swcHelpers.classPrivateFieldInit(this, _unused2, {
        get: get_unused,
        set: set_unused
    });
    console.log(swcHelpers.classPrivateFieldGet(this, _used2));
};
function get_used() {
    return 0;
}
function set_used(value) {}
function get_unused() {
    return 0;
}
function set_unused(value) {}
