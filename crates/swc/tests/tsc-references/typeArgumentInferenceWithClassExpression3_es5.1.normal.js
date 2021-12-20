function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function _class() {
        "use strict";
        _classCallCheck(this, _class);
    };
    return undefined;
}
foo(function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.prop = "hello";
}).length;
