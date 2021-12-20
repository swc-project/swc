function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _class;
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function _class1() {
        "use strict";
        _classCallCheck(this, _class1);
    };
    return undefined;
}
// Should not infer string because it is a static property
foo((_class = function _class1() {
    "use strict";
    _classCallCheck(this, _class1);
}, _class.prop = "hello", _class)).length;
