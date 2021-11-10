function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function foo(param) {
    var x = param === void 0 ? function _class() {
        "use strict";
        _classCallCheck(this, _class);
    } : param;
    return undefined;
}
foo(function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.prop = "hello";
}).length;
