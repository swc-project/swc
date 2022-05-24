import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C = /*#__PURE__*/ function(Component) {
    "use strict";
    _inherits(C, Component);
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
