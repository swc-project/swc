import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(x) {
        var _this = this;
        swcHelpers.classCallCheck(this, C), this.x = x, this.ia = 1, this.ib = function() {
            return _this.ia;
        };
    }
    return swcHelpers.createClass(C, [
        {
            key: "baz",
            value: function(x) {
                return "";
            }
        },
        {
            key: "ic",
            get: function() {
                return 1;
            },
            set: function(x) {}
        },
        {
            key: "id",
            get: function() {
                return 1;
            }
        }
    ], [
        {
            key: "foo",
            value: function(x) {}
        },
        {
            key: "bar",
            value: function(x) {}
        },
        {
            key: "sc",
            get: function() {
                return 1;
            },
            set: function(x) {}
        },
        {
            key: "sd",
            get: function() {
                return 1;
            }
        }
    ]), C;
}();
C.sa = 1, C.sb = function() {
    return 1;
};
var D = function() {
    "use strict";
    function D(y) {
        swcHelpers.classCallCheck(this, D), this.y = y;
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo",
            value: function() {}
        }
    ]), D;
}();
