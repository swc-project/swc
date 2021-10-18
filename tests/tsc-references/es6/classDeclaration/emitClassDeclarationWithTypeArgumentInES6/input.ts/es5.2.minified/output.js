function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var B = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function B(a) {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, B), this.B = a;
    }
    return Constructor = B, protoProps = [
        {
            key: "foo",
            value: function() {
                return this.x;
            }
        },
        {
            key: "BB",
            get: function() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function(c) {
                this.B = c;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), B;
}();
