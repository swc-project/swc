var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _this = this;
this.alert();
var X = /*#__PURE__*/ function() {
    "use strict";
    function X(x) {
        _class_call_check._(this, X);
        this.alert(x);
    }
    _create_class._(X, [
        {
            key: "alert",
            value: function alert() {}
        },
        {
            key: "m",
            value: function m() {
                var _this = this;
                var x = function x() {
                    // shouldn't fail
                    _this.alert();
                };
            }
        },
        {
            key: "m1",
            value: function m1() {
                var Y = function Y() {
                    _class_call_check._(this, Y);
                };
                this.alert();
            }
        }
    ]);
    return X;
}();
var o = {
    a: function a() {
        this.alert();
    },
    b: function b() {
        this.alert();
    },
    c: function c() {
        // should fail
        _this.alert();
    },
    e: {
        a: function a() {
            this.alert();
        }
    },
    f: function f() {
        this.alert();
    }
};
function f1() {
    var _this = this;
    var x = function x() {
        // should fail
        _this.alert();
    };
}
