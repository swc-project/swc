//// [lib.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var SomeClass = /*#__PURE__*/ function() {
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
var _require = require('./lib'), SomeClass = _require.SomeClass, Another = _require.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
