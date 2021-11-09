function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var C = function() {
    "use strict";
    function C(x) {
        var _this = this;
        _classCallCheck(this, C), this.x = x, this.ia = 1, this.ib = function() {
            return _this.ia;
        };
    }
    return _createClass(C, [
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
            set: function(x) {
            }
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
            value: function(x) {
            }
        },
        {
            key: "bar",
            value: function(x) {
            }
        },
        {
            key: "sc",
            get: function() {
                return 1;
            },
            set: function(x) {
            }
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
        _classCallCheck(this, D), this.y = y;
    }
    return _createClass(D, [
        {
            key: "foo",
            value: function() {
            }
        }
    ]), D;
}();
