function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "name",
            get: function() {
                return this._name;
            }
        },
        {
            key: "computedname1",
            get: function() {
                return "";
            }
        },
        {
            key: "computedname2",
            get: function() {
                return "";
            }
        },
        {
            key: "computedname3",
            set: function(x) {
            }
        },
        {
            key: "computedname4",
            set: function(y) {
            }
        },
        {
            key: "foo",
            set: function(a) {
            }
        }
    ], staticProps = [
        {
            key: "name2",
            get: function() {
                return "BYE";
            }
        },
        {
            key: "computedname",
            get: function() {
                return "";
            }
        },
        {
            key: "bar",
            set: function(b) {
            }
        },
        {
            key: "computedname",
            set: function(b) {
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
