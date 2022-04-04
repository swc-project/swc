import * as swcHelpers from "@swc/helpers";
var _prop = new WeakMap(), _roProp = new WeakMap(), A1 = function(name) {
    "use strict";
    swcHelpers.classCallCheck(this, A1), swcHelpers.classPrivateFieldInit(this, _prop, {
        get: function() {
            return "";
        },
        set: set_prop
    }), swcHelpers.classPrivateFieldInit(this, _roProp, {
        get: function() {
            return "";
        },
        set: void 0
    }), swcHelpers.classPrivateFieldSet(this, _prop, ""), swcHelpers.classPrivateFieldSet(this, _roProp, ""), console.log(swcHelpers.classPrivateFieldGet(this, _prop)), console.log(swcHelpers.classPrivateFieldGet(this, _roProp));
};
function set_prop(param) {}
