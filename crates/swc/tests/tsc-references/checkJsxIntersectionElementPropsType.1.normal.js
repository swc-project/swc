//// [checkJsxIntersectionElementPropsType.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
