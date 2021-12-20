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
            key: "getData",
            value: function() {
                var data = this.data;
                return "string" == typeof data ? data : data.join(" ");
            }
        },
        {
            key: "getData1",
            value: function() {
                return "string" == typeof this.data ? this.data : this.data.join(" ");
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), D;
}(), o = {
    prop1: "string",
    prop2: !0
};
"string" == typeof o.prop1 && o.prop1.toLowerCase();
var prop1 = o.prop1;
"string" == typeof prop1 && prop1.toLocaleLowerCase();
