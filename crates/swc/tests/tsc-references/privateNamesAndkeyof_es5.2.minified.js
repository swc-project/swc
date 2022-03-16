import * as swcHelpers from "@swc/helpers";
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap(), A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateMethodInit(this, _fooMethod), swcHelpers.classPrivateFieldInit(this, _fooProp, {
        get: function() {
            return 1;
        },
        set: set_fooProp
    }), swcHelpers.classPrivateFieldInit(this, _fooField, {
        writable: !0,
        value: 3
    }), this.bar = 3, this.baz = 3;
};
function set_fooProp(value) {}
