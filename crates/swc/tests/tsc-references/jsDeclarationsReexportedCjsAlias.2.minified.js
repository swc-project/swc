//// [lib.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var SomeClass = function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    return SomeClass.prototype.a = function() {
        return 1;
    }, SomeClass;
}();
module.exports = {
    bar: function(a) {
        return a + a;
    },
    SomeClass: SomeClass
};
//// [main.js]
var ref = require("./lib"), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
