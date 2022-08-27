//// [lib.js]
/**
 * @param {string} a
 */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function bar(a) {
    return a + a;
}
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    var _proto = SomeClass.prototype;
    _proto.a = function a() {
        return 1;
    };
    return SomeClass;
}();
module.exports = {
    bar: bar,
    SomeClass: SomeClass
};
//// [main.js]
var ref = require("./lib"), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
