function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var B = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function B() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, B), this.x = 10, this.x = 10;
    }
    return Constructor = B, protoProps = [
        {
            key: "foo",
            value: function() {
                B.log(this.x);
            }
        },
        {
            key: "X",
            get: function() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function(y) {
                this.x = y;
            }
        }
    ], staticProps = [
        {
            key: "log",
            value: function(a) {
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), B;
}();
