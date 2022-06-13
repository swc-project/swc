import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var num, strOrNum, var1, ClassWithAccessors = function() {
    "use strict";
    function ClassWithAccessors() {
        _class_call_check(this, ClassWithAccessors);
    }
    return _create_class(ClassWithAccessors, [
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
    ], [
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
    ]), ClassWithAccessors;
}();
