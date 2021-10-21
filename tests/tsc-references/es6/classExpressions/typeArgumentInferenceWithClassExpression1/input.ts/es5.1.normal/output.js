function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class1;
function foo(param) {
    var x = param === void 0 ? function _class() {
        "use strict";
        _classCallCheck(this, _class);
    } : param;
    return undefined;
}
foo((_class1 = function _class() {
    "use strict";
    _classCallCheck(this, _class);
}, _class1.prop = "hello", _class1)).length;
