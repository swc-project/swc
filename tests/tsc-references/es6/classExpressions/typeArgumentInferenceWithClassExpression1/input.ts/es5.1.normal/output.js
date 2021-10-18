function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class;
function foo(param) {
    var x = param === void 0 ? function _class() {
        "use strict";
        _classCallCheck(this, _class);
    } : param;
    return undefined;
}
foo((_class = function _class() {
    "use strict";
    _classCallCheck(this, _class);
}, _class.prop = "hello", _class)).length;
