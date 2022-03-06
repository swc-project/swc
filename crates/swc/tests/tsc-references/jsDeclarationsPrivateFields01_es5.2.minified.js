import * as swcHelpers from "@swc/helpers";
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
export var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateMethodInit(this, _calcHello), swcHelpers.classPrivateFieldInit(this, _screamingHello, {
            get: get_screamingHello,
            set: set_screamingHello
        }), swcHelpers.classPrivateFieldInit(this, _hello, {
            writable: !0,
            value: "hello"
        }), swcHelpers.classPrivateFieldInit(this, _world, {
            writable: !0,
            value: 100
        });
    }
    return swcHelpers.createClass(C, [
        {
            key: "getWorld",
            value: function() {
                return swcHelpers.classPrivateFieldGet(this, _world);
            }
        }
    ]), C;
}();
function get_screamingHello() {
    return swcHelpers.classPrivateFieldGet(this, _hello).toUpperCase();
}
function set_screamingHello(value) {
    throw "NO";
}
