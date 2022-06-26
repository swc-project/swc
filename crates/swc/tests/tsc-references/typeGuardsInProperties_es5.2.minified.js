import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var strOrNum, c1, obj1, C1 = function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    return C1.prototype.method = function() {
        strOrNum = "string" == typeof this.pp1 && this.pp1, strOrNum = "string" == typeof this.pp2 && this.pp2, strOrNum = "string" == typeof this.pp3 && this.pp3;
    }, _create_class(C1, [
        {
            key: "pp3",
            get: function() {
                return strOrNum;
            }
        }
    ]), C1;
}();
strOrNum = "string" == typeof c1.pp2 && c1.pp2, strOrNum = "string" == typeof c1.pp3 && c1.pp3, strOrNum = "string" == typeof obj1.x && obj1.x;
