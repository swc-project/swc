import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = function() {
    "use strict";
    function C(x) {
        var _this = this;
        _class_call_check(this, C), this.x = x, this.ia = 1, this.ib = function() {
            return _this.ia;
        };
    }
    return C.prototype.baz = function(x) {
        return "";
    }, C.foo = function(x) {}, C.bar = function(x) {}, _create_class(C, [
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
        _class_call_check(this, D), this.y = y;
    }
    return D.prototype.foo = function() {}, D;
}();
