//// [lib.js]
/**
 * @param {string} a
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
var _require = require('./lib'), SomeClass = _require.SomeClass, Another = _require.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
