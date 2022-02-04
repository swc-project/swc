function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var num, strOrNum, var1, ClassWithAccessors = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function ClassWithAccessors() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, ClassWithAccessors);
    }
    return Constructor = ClassWithAccessors, protoProps = [
        {
            key: "p1",
            get: function() {
                var var2;
                return num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, strOrNum;
            },
            set: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof param && param.length, num = "string" == typeof var2 && var2.length;
            }
        },
        {
            key: "pp1",
            get: function() {
                var var2;
                return num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, strOrNum;
            },
            set: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof param && param.length, num = "string" == typeof var2 && var2.length;
            }
        }
    ], staticProps = [
        {
            key: "s1",
            get: function() {
                var var2;
                return num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, strOrNum;
            },
            set: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof param && param.length, num = "string" == typeof var2 && var2.length;
            }
        },
        {
            key: "ss1",
            get: function() {
                var var2;
                return num = "string" == typeof var1 && var1.length, num = "string" == typeof var2 && var2.length, strOrNum;
            },
            set: function(param) {
                var var2;
                num = "string" == typeof var1 && var1.length, num = "string" == typeof param && param.length, num = "string" == typeof var2 && var2.length;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), ClassWithAccessors;
}();
