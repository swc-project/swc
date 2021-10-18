function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var num, var1, C1 = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C1(param) {
        var var2;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C1), num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length;
    }
    return Constructor = C1, protoProps = [
        {
            key: "p1",
            value: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length;
            }
        },
        {
            key: "p2",
            value: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length;
            }
        }
    ], staticProps = [
        {
            key: "s1",
            value: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length;
            }
        },
        {
            key: "s2",
            value: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, num = "string" == typeof param && param.length;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C1;
}();
