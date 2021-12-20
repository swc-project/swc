function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var D = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function D() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, D);
    }
    return Constructor = D, protoProps = [
        {
            key: "foo",
            value: function() {
            }
        },
        {
            key: "computedName1",
            value: function() {
            }
        },
        {
            key: "computedName2",
            value: function(a) {
            }
        },
        {
            key: "computedName3",
            value: function(a) {
                return 1;
            }
        },
        {
            key: "bar",
            value: function() {
                return this._bar;
            }
        },
        {
            key: "baz",
            value: function(a, x) {
                return "HELLO";
            }
        }
    ], staticProps = [
        {
            key: "computedname4",
            value: function() {
            }
        },
        {
            key: "computedname5",
            value: function(a) {
            }
        },
        {
            key: "computedname6",
            value: function(a) {
                return !0;
            }
        },
        {
            key: "staticMethod",
            value: function() {
                return 3;
            }
        },
        {
            key: "foo",
            value: function(a) {
            }
        },
        {
            key: "bar",
            value: function(a) {
                return 1;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), D;
}();
