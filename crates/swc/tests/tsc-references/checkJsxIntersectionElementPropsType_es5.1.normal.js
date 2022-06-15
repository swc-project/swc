import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(Component1) {
    "use strict";
    _inherits(C, Component1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(Component);
var y = new C({
    foobar: "example"
});
var x = /*#__PURE__*/ React.createElement(C, {
    foobar: "example"
});
